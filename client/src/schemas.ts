import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserSchema = registerUserSchema.omit({ name: true });

export const cardSchema = z.object({
  id: z.number().optional(),
  front: z.string(),
  back: z.string(),
  completed: z.literal<boolean>(false).optional(),
});

export const createDeckSchema = z.object({
  title: z.string().min(5),
  prompt: z.string().min(10),
  noOfCards: z.coerce.number().gt(0).lt(51),
});

export const editDeckSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  cards: z.array(cardSchema),
});
