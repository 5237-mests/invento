"use server";

import { login } from "@/lib/lib";
import { redirect } from "next/navigation";

const navigate = async (formData: FormData) => {
  let loged = false;

  try {
    const logd = await login(formData);
    if (logd) {
      loged = true;
    }
  } catch (error) {
    console.log("er", error);
  }

  if (loged) {
    redirect("/");
  } else {
    redirect("/login");
  }
};

export default navigate;
