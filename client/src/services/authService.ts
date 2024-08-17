import { API_URL } from "@/consts";
import type { IUser, LoginFormSchema, RegisterFormSchema } from "@/types";
import axios from "axios";

const AUTH_API_URL = API_URL + "/auth";

export const registerUser = async (values: RegisterFormSchema) => {
  const url = AUTH_API_URL + "/register";

  try {
    const { data } = await axios.post<IUser>(url, values);

    console.log(data);
  } catch (error) {
    console.error(error);
    throw new Error("Error happened while registering");
  }
};

export const loginUser = async (values: LoginFormSchema) => {
  const url = AUTH_API_URL + "/login";

  try {
    const { data } = await axios.post<{ token: string }>(url, values);

    console.log(data);

    localStorage.setItem("token", data.token);
  } catch (error) {
    console.error(error);
    throw new Error("Error happened while logging in");
  }
};

export const logout = () => localStorage.removeItem("token");

export const getToken = () => localStorage.getItem("token");

export const isAuth = () => !!localStorage.getItem("token");
