import express from 'express';
import prisma from 'models/prismaClient';
import authenticateJWT from '../middleware/authMiddleware';

const router = express.Router();

// Create Deck
router.post('/', authenticateJWT, async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.sendStatus(401); // Unauthorized

  try {
    const deck = await prisma.deck.create({
      data: {
        title: name,
        ownerId: userId,
      },
    });
    res.status(201).json(deck);
  } catch (error) {
    console.error("Error creating deck:", error);
    res.status(500).json({ error: 'Failed to create deck', details: (error as Error).message });
  }
});

// Edit Deck
router.put('/:id', authenticateJWT, async (req, res) => {
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
    res.status(500).json({ error: 'Failed to update deck', details: (error as Error).message });
  }
});

// Delete Deck
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.deck.delete({ where: { id: Number(id) } });
    res.status(204).send(); 
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({ error: 'Failed to delete deck', details: (error as Error).message });
  }
});

export default router;
