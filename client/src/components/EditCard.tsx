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
} from "./ui/dialog";
import { useEffect } from "react";

interface EditCardProps {
  card: ICard;
  onSubmit: (card: ICard) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function EditCard({
  card,
  onSubmit,
  open,
  setOpen,
}: EditCardProps) {
  const form = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: card,
  });

  useEffect(() => {
    form.reset(card);
  }, [card, form]);

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    form.handleSubmit(onSubmit)();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div>
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
                  text="Save"
                  loading={false}
                  loadingText="Saving..."
                  onClick={handleSubmit}
                />
              </DialogClose>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
