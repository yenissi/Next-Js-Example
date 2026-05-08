"use client";

import { useEffect, useState } from "react";
import { fetchItems } from "@/services/items-service";
import type { Item } from "@/types/item";
import { addToCart } from "@/hooks/cart";

type ItemWithQty = Item & {
  quantity: number;
};

export default function ProductsView() {
  const [items, setItems] = useState<ItemWithQty[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchItems();

      // ✅ DEFAULT QUANTITY = 0
      const withQty = data.map((item) => ({
        ...item,
        quantity: 0,
      }));

      setItems(withQty);
    }

    load();
  }, []);

  // ✅ INCREASE
  const increaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ✅ DECREASE
  const decreaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // ✅ ADD TO CART
  const handleAddToCart = (item: ItemWithQty) => {
    if (item.quantity === 0) return;

    addToCart({
      ...item,
      quantity: item.quantity,
    });

    // ✅ RESET QUANTITY TO 0
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, quantity: 0 }
          : i
      )
    );

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);
  };

  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-5">

      <h2 className="text-2xl font-bold mb-6">
        Items
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">

        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >

            {/* IMAGE */}
            <img
              src={item.image}
              className="h-40 w-full object-cover"
            />

            {/* CONTENT */}
            <div className="p-3 flex flex-col flex-1">

              <h3 className="font-semibold text-sm line-clamp-2">
                {item.title}
              </h3>

              <p className="text-green-600 font-bold mt-2">
                ₱{item.price}
              </p>

              {/* QUANTITY */}
              <div className="flex items-center justify-between mt-3">

                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-4 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300 cursor-pointer"
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-4 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300 cursor-pointer"
                >
                  +
                </button>

              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => handleAddToCart(item)}
                disabled={item.quantity === 0}
                className={`w-full mt-4 py-2 rounded-lg font-semibold transition
                  ${
                    item.quantity === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  }
                `}
              >
                Add to Cart
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* SUCCESS UI */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div className="bg-black/80 text-white px-8 py-6 rounded-2xl flex flex-col items-center shadow-2xl animate-bounce">

            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-3xl mb-3">
              ✓
            </div>

            <p className="font-semibold text-lg">
              Added to Cart
            </p>

          </div>

        </div>
      )}
    </div>
  );
}