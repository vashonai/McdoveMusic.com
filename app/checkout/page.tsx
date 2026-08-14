import type { Metadata } from "next";
import Checkout from "@/components/Checkout";

export const metadata: Metadata = {
  title: "Checkout — McDoveMusic",
  description: "Your details, payment and order summary.",
};

export default function CheckoutPage() {
  return <Checkout />;
}
