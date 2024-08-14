import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateJWT from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const router = express.Router();

// Create eck
router.post('/', authenticateJWT, async (req, res) => {
  const { title } = req.body;
  const ownerId = (req as any).user.id;
  try {
    const deck = await prisma.deck.create({
      data: { title, ownerId },
    });
    res.status(201).json(deck);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create deck' });
  }
});

// Get Decks
router.get('/', authenticateJWT, async (req, res) => {
  const ownerId = (req as any).user.id;
  const decks = await prisma.deck.findMany({
    where: { ownerId },
    include: { cards: true },
  });
  res.json(decks);
});

// Update Deck
router.put('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const deck = await prisma.deck.update({
      where: { id: Number(id) },
      data: { title },
    });
    res.json(deck);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update deck' });
  }
});

// Delete Deck
router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.deck.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete deck' });
  }
});

export default router;
