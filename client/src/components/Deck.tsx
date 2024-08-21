import { IDeck } from "@/types";
import { useParams } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useState } from "react";

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

  // States
  const [status, setStatus] = useState<"idle" | "reviewing" | "done">("idle");
  const [currentCardIndex, setCurrentCardIndex] = useState(
    parseInt(deck.cards[0].id),
  );
  const [showBack, setShowBack] = useState(false);

  const handleDoneCard = () => {
    setShowBack(false);

    if (currentCardIndex === deck.cards.length - 1) {
      setStatus("done");
    } else {
      setCurrentCardIndex((curr) => curr + 1);
    }
  };

  function Idle() {
    return (
      <>
        <h1 className="text-3xl font-bold">{deck.title}</h1>

        <p>{deck.description}</p>

        <Button onClick={() => setStatus("reviewing")}>Start</Button>
      </>
    );
  }

  function Card() {
    const card = deck.cards[currentCardIndex];
    return (
      <>
        <h1 className="text-3xl">{card.front}</h1>
        {showBack && <p text-xl>{card.back}</p>}

        <div className="flex justify-center items-center gap-10">
          {showBack ? (
            <>
              {/*  TODO: Make again put the card to the end for starters, or just leave it unmarked and always loop through cards till they're all done */}
              <Button
                variant={"destructive"}
                onClick={() => setCurrentCardIndex((curr) => curr + 1)}
              >
                Again
              </Button>
              {/* Set card as done */}
              <Button onClick={handleDoneCard}>Done</Button>
            </>
          ) : (
            <Button onClick={() => setShowBack(true)}>Show</Button>
          )}
        </div>
      </>
    );
  }

  function Done() {
    return (
      <>
        <h3 className="text-2xl">
          Congrats! You've completed this deck for now
        </h3>
      </>
    );
  }

  return (
    <div className="border rounded p-5 md:w-1/2 lg:w-1/3 md:mx-auto mx-5 flex flex-col justify-between text-center min-h-[50dvh]">
      {status === "idle" ? (
        <Idle />
      ) : status === "reviewing" ? (
        <Card />
      ) : (
        <Done />
      )}
    </div>
  );
}
