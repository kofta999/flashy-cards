import { Action, IDeck, PreviewCard } from "@/types";
import { Delete, Edit } from "lucide-react";
import { useReducer, useState } from "react";
import LoadingButton from "./LoadingButton";
import { ScrollArea } from "./ui/scroll-area";
import EditCard from "./EditCard";
import { UseMutationResult } from "@tanstack/react-query";

interface CardsPreviewProps {
  deck: IDeck;
  mutation: UseMutationResult<void, Error, IDeck, unknown>;
}

export default function CardsPreview({ deck, mutation }: CardsPreviewProps) {
  const initCards = deck.cards.map((card, id) => ({ id, ...card }));

  const [cards, dispatch] = useReducer(reducer, initCards);
  const [currentCard, setCurrentCard] = useState<PreviewCard>({
    front: "",
    back: "",
  });

  return (
    <div className="flex flex-col gap-5 h-full">
      <h3 className="text-3xl font-bold">Preview Cards</h3>
      <ScrollArea className="h-3/4">
        <div className="flex flex-col gap-4 h-full">
          {cards.map((card) => (
            <div key={card.front} className="flex border rounded p-6">
              <div>
                <h5 className="text-2xl">{card.front}</h5>
                <p>{card.back}</p>
              </div>

              <div className="ml-auto flex flex-col gap-3">
                <EditCard
                  card={currentCard}
                  onSubmit={(card) => dispatch({ card, type: "edit" })}
                  trigger={
                    <Edit
                      className="cursor-pointer"
                      onClick={() => setCurrentCard(card)}
                    />
                  }
                />

                <Delete
                  className="text-destructive cursor-pointer"
                  onClick={() => dispatch({ type: "delete", card })}
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <LoadingButton
        text="Save Deck"
        className="mt-auto"
        loading={mutation.isPending}
        loadingText="Saving..."
        onClick={() =>
          mutation.mutate({
            ...deck,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cards: cards.map(({ id, ...card }) => card),
          })
        }
      />
    </div>
  );
}

function reducer(cards: PreviewCard[], action: Action) {
  switch (action.type) {
    case "delete": {
      return cards.filter((card) => card.id === action.card.id);
    }

    case "edit": {
      return cards.map((card) =>
        card.id === action.card.id ? action.card : card,
      );
    }
    default:
      return cards;
  }
}
