import { redirect } from "next/navigation";
import { getSession } from "@/lib/lib";

export default async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  // user is logged in
  if (session.user.role === "admin") {
    redirect("/admin");
  } else if (session.user.role === "storekeeper") {
    redirect("/storekeeper");
  } else if (session.user.role === "shopkeeper") {
    redirect("/shopkeeper");
  } else {
    redirect("/unauthorized");
  }
}
