import EditCard from "@/components/EditCard";
import LoadingButton from "@/components/LoadingButton";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { editDeckSchema } from "@/schemas";
import { deleteDeck, getDeck, updateDeck } from "@/services/decksService";
import {
  Action,
  ICardsDiff,
  EditDeckSchema,
  ICard,
  IDeck,
  PreviewCard,
} from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Edit, Delete, Trash } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type ReducerState = { cards: ICard[]; diff: ICardsDiff };

export default function CreateDeck() {
  const { deckId } = useParams({ from: "/decks/$deckId/edit" });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const cachedData = queryClient.getQueryData<IDeck>(["decks", deckId]);

  const { data: currentDeck } = useQuery<IDeck>({
    initialData: cachedData,
    queryKey: ["decks", deckId],
    queryFn: () => getDeck(parseInt(deckId)),
  });

  const form = useForm<EditDeckSchema>({
    resolver: zodResolver(editDeckSchema),
    defaultValues: {
      title: "",
      description: "",
      cards: [],
    },
  });

  const [state, dispatch] = useReducer(reducer, {
    cards: currentDeck?.cards || [],
    diff: {
      deleted: [],
      updated: [],
    },
  });
  const [currentCard, setCurrentCard] = useState<PreviewCard>({
    front: "",
    back: "",
  });

  const mutation = useMutation({
    mutationFn: updateDeck,
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error happened while updating deck",
        description: "Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({ title: "Updated deck successfully!" });
      navigate({ to: "/decks" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeck,
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error happened while deleting deck",
        description: "Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({ title: "Deleted deck successfully!" });
      navigate({ to: "/decks" });
    },
  });

  useEffect(() => {
    if (currentDeck) {
      form.reset(currentDeck);
    }
  }, [currentDeck, form]);

  return (
    <>
      {!mutation.isSuccess && (
        <Form {...form}>
          <EditCard
            card={currentCard}
            onSubmit={(card) => dispatch({ card, type: "edit" })}
            open={open}
            setOpen={setOpen}
          />
          <div className="flex justify-center items-center mb-5">
            <h2 className="text-3xl font-bold mr-auto">Edit Deck</h2>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant={"destructive"}>
                  Delete
                  <Trash className="ml-2" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this deck and all its cards from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(currentDeck!.id!)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <form
            className="flex flex-col gap-5 h-[90%]"
            onSubmit={form.handleSubmit((v) =>
              mutation.mutate({ ...v, id: parseInt(deckId), diff: state.diff }),
            )}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name of your deck"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what your deck should be about"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ScrollArea className="h-1/2">
              <div className="flex flex-col gap-4">
                {state.cards.map((card) => (
                  <div key={card.front} className="flex border rounded p-6">
                    <div>
                      <h5 className="text-2xl">{card.front}</h5>
                      <p>{card.back}</p>
                    </div>

                    <div className="ml-auto flex flex-col gap-3">
                      <Delete
                        className="text-destructive cursor-pointer"
                        onClick={() => dispatch({ type: "delete", card })}
                      />
                      <Edit
                        className="cursor-pointer"
                        onClick={() => {
                          setOpen((o) => !o);
                          setCurrentCard(card);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <LoadingButton
              text="Update Deck"
              className="mt-auto"
              loading={mutation.isPending}
              loadingText="Saving..."
            />
          </form>
        </Form>
      )}
    </>
  );
}

function reducer(
  { cards, diff: { deleted, updated } }: ReducerState,
  action: Action,
): ReducerState {
  switch (action.type) {
    case "delete": {
      return {
        diff: { updated, deleted: [...deleted, { id: action.card.id! }] },
        cards: cards.filter((card) => card.id !== action.card.id),
      };
    }

    case "edit": {
      return {
        diff: {
          deleted,
          updated: [
            ...updated.filter((c) => c.id !== action.card.id),
            action.card,
          ],
        },
        cards: cards.map((card) =>
          card.id === action.card.id ? action.card : card,
        ),
      };
    }
    default:
      return { cards, diff: { deleted, updated } };
  }
}
