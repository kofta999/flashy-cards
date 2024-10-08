import { createDeckSchema } from "@/schemas";
import { CreateDeckSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { generateCards } from "@/services/aiService";
import { useToast } from "../components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
import CardsPreview from "@/components/CardsPreview";
import { createDeck } from "@/services/decksService";
import { useNavigate } from "@tanstack/react-router";

export default function CreateDeck() {
  const form = useForm<CreateDeckSchema>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: { title: "", prompt: "", noOfCards: 1 },
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const generateCardsMutation = useMutation({
    mutationFn: generateCards,
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error happened while generating cards",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitMuatation = useMutation({
    mutationFn: createDeck,
    onSuccess: () => navigate({ to: "/decks" }),
    onError: () =>
      toast({
        title: "Error happened while submitting",
        variant: "destructive",
      }),
  });

  return (
    <>
      {generateCardsMutation.isSuccess && (
        <CardsPreview
          deck={generateCardsMutation.data}
          mutation={submitMuatation}
        />
      )}

      {!generateCardsMutation.isSuccess && (
        <Form {...form}>
          <h2 className="text-3xl font-bold mb-5">Create Deck</h2>
          <form
            className="flex flex-col gap-5 h-[90%]"
            onSubmit={form.handleSubmit((v) => generateCardsMutation.mutate(v))}
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
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
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

            <FormField
              control={form.control}
              name="noOfCards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of cards</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of cards you want"
                      min={1}
                      max={50}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              text="Generate Deck!"
              className="mt-auto"
              loading={generateCardsMutation.isPending}
              loadingText="Generating cards..."
            />
          </form>
        </Form>
      )}
    </>
  );
}
