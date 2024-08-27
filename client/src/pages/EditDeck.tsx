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
import { getDeck, updateDeck } from "@/services/decksService";
import { EditDeckSchema, IDeck } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function CreateDeck() {
  const { deckId } = useParams({ from: "/decks/$deckId/edit" });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (currentDeck) {
      form.reset(currentDeck);
    }
  }, [currentDeck, form]);

  return (
    <>
      {!mutation.isSuccess && (
        <Form {...form}>
          <h2 className="text-3xl font-bold mb-5">Edit Deck</h2>
          <form
            className="flex flex-col gap-5 h-full"
            onSubmit={form.handleSubmit((v) =>
              mutation.mutate({ ...v, id: parseInt(deckId) }),
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

            <LoadingButton
              text="Update Deck"
              className="mt-auto"
              loading={mutation.isPending}
              loadingText="Generating cards..."
            />
          </form>
        </Form>
      )}
    </>
  );
}
