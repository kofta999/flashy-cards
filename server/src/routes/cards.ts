import express from 'express';
import prisma from '../models/prismaClient';
import authenticateJWT from '../middleware/authMiddleware';

const router = express.Router();

// Create Card
router.post('/', authenticateJWT, async (req, res) => {
  const { front, back, deckId } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.sendStatus(401); // Unauthorized

  try {
    // Check if the deck exists
    const deck = await prisma.deck.findUnique({ where: { id: Number(deckId) } });
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Create the card
    const card = await prisma.card.create({
      data: {
        front,
        back,
        deckId: Number(deckId),
      },
    });

    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating card:", error);
    res.status(500).json({ error: 'Failed to create card', details: (error as Error).message });
  }
});

// Update Card
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { front, back } = req.body;

  try {
      const card = await prisma.card.update({
      where: { id: Number(id) },
      data: {
        front,
        back, 
      },
    });

    res.json(card);
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ error: 'Failed to update card', details: (error as Error).message });
  }
});

// Delete Card
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.card.delete({ where: { id: Number(id) } });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: 'Failed to delete card', details: (error as Error).message });
  }
});


router.put('/edit-cards/:deckId', authenticateJWT, async(req, res)=> {
  const { deckId } = req.params;
  const { cards } = req.body;

  if(!cards || !Array.isArray(cards)) {
    return res.status(400).json({error: "invalid or non-existent card data"})

  }

  try {
    const deck = await prisma.deck.findUnique({where: {id: Number(deckId)}});
    if(!deck) {
      return res.status(404).json({error: " Deck doesnt exist"});

    }
    const updatedCards = await prisma.$transaction(
      cards.map((card) =>
        prisma.card.update({
          where: { id: card.id },
          data: {
            front: card.front,
            back: card.back,
          },
        })
      )
    );

    res.json(updatedCards);
  } catch (error) {
    console.error('Error updating cards:', error);
    res.status(500).json({ error: 'Failed to update cards', details: (error as Error).message });
  }
});

export default router;
