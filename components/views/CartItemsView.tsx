"use client";

import { useEffect, useState } from "react";

import {
  getCart,
  removeFromCart,
  clearCart,
} from "@/hooks/cart";

import type { CartItem } from "@/types/cart";

import {
  ShoppingCart,
  Trash2,
  X,
  PackageCheck,
} from "lucide-react";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function CartView() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [confirmClear, setConfirmClear] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [animationKey, setAnimationKey] =
    useState(0);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function showDeleteSuccess() {
    setAnimationKey(Date.now());

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1800);
  }

  function handleRemove(id: number) {
    removeFromCart(id);

    const updatedCart = getCart();

    setCart(updatedCart);

    if (updatedCart.length === 0) {
      showDeleteSuccess();
    }
  }

  function handleClear() {
    clearCart();

    setCart([]);

    showDeleteSuccess();
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* SUCCESS ANIMATION */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center animate-in fade-in zoom-in-95">

            <div className="w-44 h-44">
              <DotLottieReact
                key={animationKey}
                src="/animations/checkmark.lottie"
                loop={false}
                autoplay
                renderConfig={{
                  autoResize: true,
                }}
              />
            </div>

            <h2 className="text-2xl font-bold -mt-2">
              Deleted Successfully
            </h2>

            <p className="text-gray-500 mt-2 text-center">
              Your cart is now empty
            </p>

          </div>

        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <div className="bg-black text-white p-3 rounded-2xl">
          <ShoppingCart size={24} />
        </div>

        <div>

          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          <p className="text-gray-500 text-sm">
            {cart.length} item
            {cart.length !== 1 && "s"} in your cart
          </p>

        </div>

      </div>

      {/* EMPTY CART */}
      {cart.length === 0 && !showSuccess ? (
        <div className="flex flex-col items-center justify-center mt-24">

          <div className="bg-white shadow-lg rounded-3xl p-10 flex flex-col items-center max-w-sm">

            <div className="bg-gray-100 p-5 rounded-full mb-5">

              <PackageCheck
                size={50}
                className="text-gray-400"
              />

            </div>

            <h2 className="text-2xl font-bold mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 text-center">
              Looks like you haven’t added anything yet.
            </p>

          </div>

        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">

          {/* CART LIST */}
          <div className="space-y-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 flex justify-between items-center"
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <div>

                    <h2 className="font-bold text-lg line-clamp-1">
                      {item.title}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      ₱{item.price} × {item.quantity}
                    </p>

                    <p className="text-green-600 font-bold mt-2">
                      ₱
                      {(
                        item.price * item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>

                </div>

                {/* DELETE */}
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>

              </div>
            ))}

          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">

            <h2 className="text-xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Items
                </span>

                <span>
                  {cart.length}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Total
                </span>

                <span className="font-bold text-lg">
                  ₱{total.toFixed(2)}
                </span>

              </div>

            </div>

            <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition cursor-pointer">
              Checkout
            </button>

            <button
              onClick={() => setConfirmClear(true)}
              className="w-full mt-3 border border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition cursor-pointer"
            >
              Clear Cart
            </button>

          </div>

        </div>
      )}

      {/* DELETE MODAL */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">

          <div className="bg-white w-[350px] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold">
                Remove Item
              </h2>

              <button
                onClick={() => setDeleteId(null)}
                className="cursor-pointer"
              >
                <X />
              </button>

            </div>

            <p className="text-gray-500 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-200 py-3 rounded-xl hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleRemove(deleteId);
                  setDeleteId(null);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition cursor-pointer"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {/* CLEAR CART MODAL */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">

          <div className="bg-white w-[350px] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-xl font-bold">
                Clear Cart
              </h2>

              <button
                onClick={() => setConfirmClear(false)}
                className="cursor-pointer"
              >
                <X />
              </button>

            </div>

            <p className="text-gray-500 mb-6">
              This will remove all items from your cart permanently.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleClear();
                  setConfirmClear(false);
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition cursor-pointer"
              >
                Clear Cart
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}