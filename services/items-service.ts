import { itemsData } from "./items-data";
import type { Item } from "@/types/item";

export const fetchItems = async (): Promise<Item[]> => {
  return itemsData;
};