import express from "express";
import { Request, Response } from "express";
import { Card, PrismaClient } from "@prisma/client";
import authenticateJWT from "../middleware/authMiddleware";

const prisma = new PrismaClient();
const router = express.Router();

interface MyRequest<T> extends Request {
  body: T;
}

interface CreateDeckDTO {
  title: string;
  description: string;
  cards: Array<{
    front: string;
    back: string;
  }>;
}

type EditDeckDTO = {
  title: string;
  description: string;
  diff: {
    deleted: { id: number }[];
    updated: Omit<Card, "deckId">[];
  };
};

// Create deck
router.post(
  "/",
  authenticateJWT,
  async (req: MyRequest<CreateDeckDTO>, res: Response) => {
    const { title, description, cards } = req.body;
    const ownerId = (req as any).user.id;

    try {
      const deck = await prisma.$transaction(async (prisma) => {
        const createdDeck = await prisma.deck.create({
          data: {
            title,
            description,
            ownerId,
          },
        });
        const cardData = cards.map((card) => ({
          front: card.front,
          back: card.back,
          deckId: createdDeck.id,
        }));

        await prisma.card.createMany({
          data: cardData,
        });

        return createdDeck;
      });

      // Alternative approach
      // const deck = await prisma.deck.create({
      //   data: {
      //     title,
      //     description,
      //     cards: { createMany: { data: cards } },
      //     ownerId,
      //   },
      // });

      res.status(201).json(deck);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to create deck and cards" });
    }
  },
);

router.get("/:id", authenticateJWT, async (req, res) => {
  const ownerId = (req as any).user.id;

  // TODO: handle errors here if id is a literal string
  const deckId = parseInt(req.params.id);

  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId, ownerId },
      include: {
        cards: true,
      },
    });

    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    const { id, title, cards, description } = deck;

    res.status(200).json({ id, title, description, cards });
  } catch (error) {
    console.error("Error fetching deck:", error);
    res.status(500).json({
      error: "Failed to fetch deck",
      details: (error as Error).message,
    });
  }
});

// Get Decks
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
  const ownerId = (req as any).user.id;
  const decks = await prisma.deck.findMany({
    where: { ownerId },
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          cards: {
            where: { completed: false },
          },
        },
      },
    },
  });

  const mappedDecks = decks.map((deck) => ({
    id: deck.id,
    title: deck.title,
    dueCardsCount: deck._count.cards,
  }));

  res.json(mappedDecks);
});

// Update Deck
router.put(
  "/:id",
  authenticateJWT,
  async (req: MyRequest<EditDeckDTO>, res: Response) => {
    const { id } = req.params;
    const { title, description, diff } = req.body;
    try {
      const deck = await prisma.deck.update({
        where: { id: Number(id) },
        data: {
          title,
          description,
          cards: {
            deleteMany: diff.deleted,
            updateMany: diff.updated.map((card) => ({
              where: { id: card.id },
              data: card,
            })),
          },
        },
      });
      res.json(deck);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to update deck" });
    }
  },
);

// Delete Deck
router.delete("/:id", authenticateJWT, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.deck.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete deck" });
  }
});

export default router;
