import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import deckRoutes from './routes/decks';
import cardRoutes from './routes/cards';

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/decks', deckRoutes);
app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
