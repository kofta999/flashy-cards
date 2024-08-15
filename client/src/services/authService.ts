import { API_URL } from "@/consts";
import type { IUser, RegisterFormSchema } from "@/types";
import axios from "axios";

const AUTH_API_URL = API_URL + "/auth";
export const registerUser = async (values: RegisterFormSchema) => {
  const url = AUTH_API_URL + "/register";

  try {
    await new Promise((r) => setTimeout(r, 2000));
    const { data } = await axios.post<IUser>(url, values);

    console.log(data);
  } catch (error) {
    console.error(error);
    throw new Error("Error happened while registering");
  }
};
