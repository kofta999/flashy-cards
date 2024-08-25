import { createDeck } from "@/services/decksService";
import { ICard, IDeck } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Delete, Edit } from "lucide-react";
import { useReducer } from "react";
import LoadingButton from "./LoadingButton";
import { useNavigate } from "@tanstack/react-router";

interface CardsPreviewProps {
  deck: IDeck;
}

type PreviewCard = Pick<ICard, "front" | "back">;
type Action = {
  card: PreviewCard;
  type: "delete" | "edit";
};

export default function CardsPreview({ deck }: CardsPreviewProps) {
  const initCards = deck.cards;
  const navigate = useNavigate();
  const [cards, dispatch] = useReducer(reducer, initCards);
  const mutation = useMutation({
    mutationFn: createDeck,
    onSuccess: () => navigate({ to: "/home" }),
  });

  return (
    <>
      <ul>
        {cards.map((card) => (
          <li key={card.front}>
            <div>
              <h5>{card.front}</h5>
              <p>{card.back}</p>
            </div>

            <div>
              <Edit />
              <Delete onClick={() => dispatch({ type: "delete", card })} />
            </div>
          </li>
        ))}
      </ul>
      <LoadingButton
        text="Save Deck"
        loading={mutation.isPending}
        loadingText="Saving..."
        onClick={() => mutation.mutate({ ...deck, cards })}
      />
    </>
  );
}

function reducer(cards: PreviewCard[], action: Action) {
  switch (action.type) {
    case "delete": {
      return cards.filter(
        (card) =>
          card.front !== action.card.front && card.back !== action.card.back,
      );
    }

    // case "edit": {
    //   return cards.map(
    //     (card) =>
    //       card.front === action.card.front && card.back === action.card.back ? action.,
    //   );
    // }
    default:
      return cards;
  }
}
