"use server";
import { login } from "@/lib/lib";

const loginn = async (formData: FormData) => {
  try {
    await login(formData);
  } catch (error) {
    console.log(error);
  }
};

export default loginn;
