import React, { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
};

export default function StoreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
