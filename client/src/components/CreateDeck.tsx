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
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { generateCards } from "@/services/aiService";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "./LoadingButton";
import CardsPreview from "./CardsPreview";

export default function CreateDeck() {
  const form = useForm<CreateDeckSchema>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: { title: "", prompt: "", noOfCards: 1 },
  });

  const { toast } = useToast();

  const mutation = useMutation({
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

  return (
    <div className="border rounded p-5 md:w-1/2 lg:w-1/3 md:mx-auto mx-5 h-[75dvh]">
      {mutation.isSuccess && <CardsPreview deck={mutation.data} />}
      {!mutation.isSuccess && (
        <Form {...form}>
          <form
            className="flex flex-col gap-5 h-full"
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
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
              loading={mutation.isPending}
              loadingText="Generating cards..."
            />
          </form>
        </Form>
      )}
    </div>
  );
}
