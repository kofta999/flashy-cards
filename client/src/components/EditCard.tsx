import { cardSchema } from "@/schemas";
import { ICard } from "@/types";
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
import LoadingButton from "./LoadingButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ReactNode, useEffect } from "react";

interface EditCardProps {
  card: ICard;
  onSubmit: (card: ICard) => void;
  trigger: ReactNode;
}

export default function EditCard({ card, onSubmit, trigger }: EditCardProps) {
  const form = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: card,
  });

  useEffect(() => {
    form.reset(card);
  }, [card, form]);

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="front"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Front</FormLabel>
                  <FormControl>
                    <Input placeholder="The question of the card" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="back"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Back</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="The answer of the question"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <LoadingButton
                  type="submit"
                  text="Save"
                  loading={form.formState.isSubmitting}
                  loadingText="Saving..."
                />
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
