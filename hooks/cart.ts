import type { CartItem } from "@/types/cart";

const CART_KEY = "cart_items";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCart(): CartItem[] {
  if (!isBrowser()) return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export function saveCart(cart: CartItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// 🔥 FIXED: now accepts quantity
export function addToCart(
  item: Omit<CartItem, "quantity"> & { quantity: number }
) {
  const cart = getCart();

  const existing = cart.find((i) => i.id === item.id);

  if (existing) {
    existing.quantity += item.quantity; // 🔥 add selected qty
  } else {
    cart.push({
      ...item,
      quantity: item.quantity,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id: number) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}