import DeckList from "@/components/DeckList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getDecks } from "@/services/decksService";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data, error, status } = useQuery({
    queryKey: ["decks"],
    queryFn: getDecks,
  });

  useEffect(() => {
    if (status === "error" && error) {
      console.error(error);
      toast({
        title: "Error happened while fetching decks",
        description: "Please try again",
        variant: "destructive",
      });
    }

    if (status === "success") {
      toast({ title: "Loaded Decks successfully" });
    }
  }, [status, error, toast]);

  return (
    <div>
      <main className="border rounded p-5 md:w-1/2 lg:w-1/3 md:mx-auto mx-5 flex flex-col gap-5 text-center min-h-[50dvh]">
        <header className="mb-5 flex">
          <h1 className="text-3xl font-bold mr-auto">Deck List</h1>
          <Button
            onClick={() => navigate({ to: "/home/decks/new" })}
            variant={"outline"}
          >
            Create
          </Button>
        </header>

        {status === "success" && data.length > 0 && <DeckList decks={data} />}
        {status === "pending" && (
          <Loader2 className=" mx-auto animate-spin w-10 h-10 mt-10 mb-10" />
        )}
        {status === "success" && data.length === 0 && (
          <h2>You've no decks currently, press Create to create a new deck</h2>
        )}
      </main>
    </div>
  );
}
