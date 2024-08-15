import { z } from "zod";
import { registerUserSchema } from "./schemas";

export type RegisterFormSchema = z.infer<typeof registerUserSchema>;

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
}
