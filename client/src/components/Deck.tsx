import { IDeck } from "@/types";
import { useParams } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function Deck() {
  const { deckId } = useParams({ from: "/home/decks/$deckId" });
  // TODO: Fetch

  const deck: IDeck = {
    id: parseInt(deckId),
    title: "Basic Japanese",
    description: "This deck contains basic Japanese vocabulary",
    cards: [
      { id: "1", front: "こんにちは", back: "Hello", completed: false },
      { id: "2", front: "ありがとう", back: "Thank you", completed: false },
      { id: "3", front: "さようなら", back: "Goodbye", completed: false },
      { id: "4", front: "はい", back: "Yes", completed: false },
      { id: "5", front: "いいえ", back: "No", completed: false },
    ],
  };

  return (
    <div className="border rounded p-5 md:w-1/2 md:mx-auto mx-5 flex flex-col justify-between text-center min-h-[50dvh]">
      <h1 className="text-3xl font-bold">{deck.title}</h1>

      <p>{deck.description}</p>

      <Button>Start</Button>
    </div>
  );
}
