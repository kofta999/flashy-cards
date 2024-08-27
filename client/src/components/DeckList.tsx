import { IDeckItem } from "@/types";
import { Separator } from "./ui/separator";
import { Link } from "@tanstack/react-router";

interface DeckListProps {
  decks: IDeckItem[];
}

export default function DeckList({ decks }: DeckListProps) {
  return (
    <ul className="grid gap-3">
      {decks.flatMap((deck, i) => [
        <li key={deck.id}>
          <Link className="flex items-center" to={`/decks/${deck.id}`}>
            <div className="mr-auto text-2xl">{deck.title}</div>

            <div>
              {deck.dueCardsCount > 0
                ? `${deck.dueCardsCount} due`
                : "Completed for today"}
            </div>
          </Link>
        </li>,
        i !== decks.length - 1 && <Separator key={`separator-${deck.id}`} />,
      ])}
    </ul>
  );
}
