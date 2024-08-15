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
