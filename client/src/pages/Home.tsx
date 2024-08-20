import DeckList from "@/components/DeckList";
import { Button } from "@/components/ui/button";
import { IDeckItem } from "@/types";

export default function Home() {
  // TODO: State management

  const deckItems: IDeckItem[] = [
    { id: 1, dueCardsCount: 10, title: "Deck 1" },
    { id: 2, dueCardsCount: 20, title: "Deck 2" },
    { id: 3, dueCardsCount: 30, title: "Deck 3" },
    { id: 4, dueCardsCount: 40, title: "Deck 4" },
    { id: 5, dueCardsCount: 50, title: "Deck 5" },
  ];

  return (
    <div>
      <main className="border rounded p-5 md:w-1/2 lg:w-1/3 md:mx-auto mx-5">
        <header className="mb-5 flex">
          <h1 className="text-3xl font-bold mr-auto">Deck List</h1>
          <Button variant={"outline"}>Create</Button>
        </header>

        <DeckList decks={deckItems} />
      </main>
    </div>
  );
}
