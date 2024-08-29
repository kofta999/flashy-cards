import { z } from "zod";
import {
  cardSchema,
  createDeckSchema,
  editDeckSchema,
  loginUserSchema,
  registerUserSchema,
} from "./schemas";

export type RegisterFormSchema = z.infer<typeof registerUserSchema>;

export type LoginFormSchema = z.infer<typeof loginUserSchema>;

export type CreateDeckSchema = z.infer<typeof createDeckSchema>;

export type EditDeckSchema = z.infer<typeof editDeckSchema>;

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
  id?: number;
  title: string;
  description: string;
  cards: ICard[];
}

export type ICard = z.infer<typeof cardSchema>;

export type PreviewCard = Omit<ICard, "completed">;

export type Action = {
  card: PreviewCard;
  type: "delete" | "edit";
};

export type ICardsDiff = {
  deleted: { id: number }[];
  updated: ICard[];
};
