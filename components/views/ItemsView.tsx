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
  const [toast, setToast] = useState<string | null>(null);

useEffect(() => {
  async function load() {
    // CHECK CACHE
    const cachedItems = localStorage.getItem("items");

    if (cachedItems) {
      setItems(JSON.parse(cachedItems));
      return;
    }

    // FETCH API
    const data = await fetchItems();

    const itemsWithQty = data.map((item) => ({
      ...item,
      quantity: 1,
    }));

    setItems(itemsWithQty);

    // SAVE CACHE
    localStorage.setItem(
      "items",
      JSON.stringify(itemsWithQty)
    );
  }

  load();
}, []);

  const increaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleAddToCart = (item: ItemWithQty) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    });

    // 🔥 TOAST with quantity
    setToast(`${item.title} ×${item.quantity} added to cart`);

    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  if (!items.length) {
    return (
      <div className="text-lg flex items-center justify-center h-[80vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 relative">

      <h2 className="text-2xl font-bold mb-6 mt-4">
        Items
      </h2>

      {/* 🔥 TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">

        {items.map((item) => (
          <div
            key={item.id}
            className="
              bg-white rounded-xl shadow-md overflow-hidden
              transition transform hover:scale-105 hover:shadow-xl
            "
          >

            <img
              src={item.image}
              className="h-40 w-full object-cover"
            />

            <div className="p-3">

              <h3 className="font-semibold text-sm line-clamp-2">
                {item.title}
              </h3>

              <p className="text-green-600 font-bold mt-2">
                ${item.price}
              </p>

              {/* QUANTITY */}
              <div className="flex items-center justify-between mt-3">

                <button
                  onClick={() => decreaseQty(item.id)}
                  className="
                    px-3 py-1 bg-gray-200 rounded
                    cursor-pointer
                    hover:bg-gray-300
                    transition
                  "
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="
                    px-3 py-1 bg-gray-200 rounded
                    cursor-pointer
                    hover:bg-gray-300
                    transition
                  "
                >
                  +
                </button>

              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => handleAddToCart(item)}
                className="
                  w-full mt-4 py-2 bg-green-600 text-white rounded-lg font-semibold
                  hover:bg-green-700 hover:scale-[1.02]
                  transition cursor-pointer
                "
              >
                Add to Cart
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}