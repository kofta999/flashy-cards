import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const authenticateJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


router.post('/cards', authenticateJWT, async (req, res) => {
    const { front, back, deckId } = req.body;
    const userId = req.user?.id;
  
    if (!userId) return res.sendStatus(401); // Unauthorized
  
    try {
      // Check if the deck exists
      const deck = await prisma.deck.findUnique({ where: { id: deckId } });
      if (!deck) {
        return res.status(404).json({ error: 'Deck not found' });
      }
  
      const card = await prisma.card.create({
        data: {
          front,
          back,
          deckId,
        },
      });
  
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating card:", error);
      res.status(500).json({ error: 'Failed to create card', details: (error as Error).message });
    }
  });
  

router.put('/cards/:id', authenticateJWT, async (req, res) => {
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

router.delete('/cards/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.card.delete({ where: { id: Number(id) } });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: 'Failed to delete card', details: (error as Error).message });
  }
});

export default router;
