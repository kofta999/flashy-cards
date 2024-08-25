import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserSchema = registerUserSchema.omit({ name: true });

export const createDeckSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(1),
  noOfCards: z.coerce.number().gt(0).lt(51),
});
