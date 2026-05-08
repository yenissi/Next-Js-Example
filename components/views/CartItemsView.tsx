"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  clearCart,
} from "@/hooks/cart";

import type { CartItem } from "@/types/cart";

export default function CartView() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleRemove(id: number) {
    removeFromCart(id);
    setCart(getCart());
  }

  function handleClear() {
    clearCart();
    setCart([]);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mt-2 mb-4">Cart</h1>

      {/* CART ITEMS */}
      {cart.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border p-3 rounded gap-4"
              >
                {/* 🔥 IMAGE + INFO */}
                <div className="flex items-center gap-3">

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />

                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">
                      ₱{item.price} × {item.quantity}
                    </p>
                  </div>

                </div>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="mt-6 text-xl font-bold">
            Total: ₱{total.toFixed(2)}
          </div>

          {/* CLEAR CART */}
          <button
            onClick={() => setConfirmClear(true)}
            className="mt-3 bg-black text-white px-4 py-2 rounded cursor-pointer hover:opacity-80"
          >
            Clear Cart
          </button>
        </>
      )}

      {/* 🔥 DELETE MODAL */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">

            <h2 className="text-lg font-bold mb-4">
              Remove this item?
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleRemove(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

      {/* 🔥 CLEAR MODAL */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">

            <h2 className="text-lg font-bold mb-4">
              Clear entire cart?
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              All items will be removed permanently.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleClear();
                  setConfirmClear(false);
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                Clear
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}