import { itemsData } from "./items-data";
import type { Item } from "@/types/item";

let cache: Item[] | null = null;

export const fetchItems = async (): Promise<Item[]> => {
  // 🔥 return cached data instantly if available
  if (cache) {
    return cache;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      cache = itemsData; // store in memory cache
      // Also cache in localStorage for PWA offline support
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("items-cache", JSON.stringify(itemsData));
        } catch (err) {
          // LocalStorage might be disabled or full, continue anyway
          console.warn("Failed to cache items in localStorage", err);
        }
      }
      resolve(itemsData);
    }, 300);
  });
};