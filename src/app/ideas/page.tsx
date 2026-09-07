import type { Metadata } from "next";
import { BuzonIdeas } from "@/components/buzon-ideas";

export const metadata: Metadata = { title: "Buzón de ideas" };

export default function PaginaIdeas() {
  return <BuzonIdeas />;
}
