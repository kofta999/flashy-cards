import { useParams } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeck } from "@/services/decksService";
import { useToast } from "../components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function Deck() {
  const { deckId } = useParams({ from: "/decks/$deckId" });

  const {
    data: deck,
    error,
    status,
  } = useQuery({
    queryKey: ["deck"],
    queryFn: () => getDeck(parseInt(deckId)),
    initialData: { id: 0, title: "", cards: [], description: "" },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (status === "error" && error) {
      console.error(error);
      toast({
        title: "Error happened while fetching deck",
        description: "Please try again",
        variant: "destructive",
      });
    }

    if (status === "success") {
      toast({ title: "Loaded successfully" });
    }
  }, [status, error, toast]);

  // States
  const [state, setState] = useState<"idle" | "reviewing" | "done">("idle");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const handleDoneCard = () => {
    setShowBack(false);

    if (currentCardIndex === deck.cards.length - 1) {
      setState("done");
    } else {
      setCurrentCardIndex((curr) => curr + 1);
    }
  };

  function Idle() {
    return (
      <>
        <h1 className="text-3xl font-bold">{deck.title}</h1>

        <p>{deck.description}</p>

        <Button onClick={() => setState("reviewing")}>Start</Button>
      </>
    );
  }

  function Card() {
    const card = deck.cards[currentCardIndex];
    return (
      <>
        <h1 className="text-3xl">{card.front}</h1>
        {showBack && <p className="text-xl">{card.back}</p>}

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
          Congrats! You've completed this deck for now.
        </h3>
      </>
    );
  }

  return (
    <div className="flex flex-col justify-between text-center h-full">
      {deck.id === 0 && (
        <Loader2 className=" mx-auto animate-spin w-10 h-10 mt-10 mb-10" />
      )}

      {deck.id !== 0 &&
        (state === "idle" ? (
          <Idle />
        ) : state === "reviewing" ? (
          <Card />
        ) : (
          <Done />
        ))}
    </div>
  );
}
