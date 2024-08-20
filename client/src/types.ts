import { z } from "zod";
import { loginUserSchema, registerUserSchema } from "./schemas";

export type RegisterFormSchema = z.infer<typeof registerUserSchema>;

export type LoginFormSchema = z.infer<typeof loginUserSchema>;

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface IDeckItem {
  id: number;
  dueCardsCount: number;
  title: string;
}

export interface IDeck {
  id: number;
  title: string;
  description: string;
  cards: ICard[];
}

export interface ICard {
  id: string;
  front: string;
  back: string;
  completed: boolean;
}
