import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;

app.use(bodyParser.json());

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

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: 'Failed to register user', details: (error as Error).message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: 'Failed to login user', details: (error as Error).message });
  }
});

// Create Deck
app.post('/decks', authenticateJWT, async (req, res) => {
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
app.put('/decks/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user?.id;

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
app.delete('/decks/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.deck.delete({ where: { id: Number(id) } });
    res.status(204).send(); 
  } catch (error) {
    console.error("Error deleting deck:", error);
    res.status(500).json({ error: 'Failed to delete deck', details: (error as Error).message });
  }
});

// Create Card
app.post('/cards', authenticateJWT, async (req, res) => {
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
app.put('/cards/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { front, back } = req.body;

  try {
    // Update the card
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
app.delete('/cards/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.card.delete({ where: { id: Number(id) } });
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ error: 'Failed to delete card', details: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});