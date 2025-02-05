import { Produit } from "@/sanity.types";

export type CartProduit = Produit & {
  selectedFlavor?: string;
  slug: string | { current: string };
};