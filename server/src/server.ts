import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import deckRoutes from "./routes/decks";
import cardRoutes from "./routes/cards";
import dotenv from "dotenv";

const app = express();
const PORT = 4000;

dotenv.config();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/decks", deckRoutes);
app.use("/cards", cardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
