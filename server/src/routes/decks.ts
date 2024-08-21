import express from "express";
import prisma from "../models/prismaClient";
import authenticateJWT from "../middleware/authMiddleware";

const router = express.Router();

// Get decks
router.get("/", authenticateJWT, async (req, res) => {
  const ownerId = (req as any).user.id;

  try {
    const decks = await prisma.deck.findMany({
      where: { ownerId },
      include: {
        _count: { select: { cards: { where: { completed: false } } } },
      },
    });

    const formattedDecks = decks.map((deck) => ({
      id: deck.id,
      title: deck.title,
      dueCardsCount: deck._count.cards,
    }));

    res.status(200).json(formattedDecks);
  } catch (error) {
    console.error("Error fetching decks:", error);
    res.status(500).json({
      error: "Failed to fetch decks",
      details: (error as Error).message,
    });
  }
});

// Get a single deck
router.get("/:id", authenticateJWT, async (req, res) => {
  const ownerId = (req as any).user.id;

  // TODO: handle errors here if id is a literal string
  const deckId = parseInt(req.params.id);

  try {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId, ownerId },
      include: {
        cards: {
          select: { id: true, front: true, back: true, completed: true },
        },
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

// Create Deck
router.post("/", authenticateJWT, async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.sendStatus(401); // Unauthorized

  try {
    const deck = await prisma.deck.create({
      data: {
        title: name,
        description,
        ownerId: userId,
      },
    });
    res.status(201).json(deck);
  } catch (error) {
    console.error("Error creating deck:", error);
    res.status(500).json({
      error: "Failed to create deck",
      details: (error as Error).message,
    });
  }
});

// Edit Deck
router.put("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const deck = await prisma.deck.update({
      where: { id: Number(id) },
      data: { title: name }, // Assuming `title` is the correct field for deck name
    });
    res.json(deck);
  } catch (error) {
    console.error("Error updating deck:", error);
    res.status(500).json({
      error: "Failed to update deck",
      details: (error as Error).message,
    });
  }
});

// Delete Deck
router.delete("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.deck.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({
      error: "Failed to delete deck",
      details: (error as Error).message,
    });
  }
});

export default router;
