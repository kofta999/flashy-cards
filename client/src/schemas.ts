import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserSchema = registerUserSchema.omit({ name: true });

export const createDeckSchema = z.object({
  title: z.string().min(5),
  prompt: z.string().min(10),
  noOfCards: z.coerce.number().gt(0).lt(51),
});
