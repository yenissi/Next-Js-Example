"use client";

import { useState } from "react";

type View =
  | "products"
  | "authors"
  | "users"
  | "items"
  | "cart";

export default function Sidebar({
  setView,
}: {
  setView: (view: View) => void;
}) {
  const [open, setOpen] = useState(false);

  const menu = [
    { label: "Products", value: "products" },
    { label: "Authors", value: "authors" },
    { label: "Users", value: "users" },
    { label: "Items", value: "items" },
    { label: "Cart", value: "cart" }, // 🔥 NEW
  ] as const;

  return (
    <>
      {/* HAMBURGER */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-1.5 bg-gray-900 text-white rounded fixed top-3 left-3 z-50 cursor-pointer hover:bg-gray-700 transition"
      >
        ☰
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-4 z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* CLOSE */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold">Menu</h1>

          <button
            onClick={() => setOpen(false)}
            className="text-white text-xl cursor-pointer hover:text-gray-300 transition"
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <ul className="space-y-2">
          {menu.map((item) => (
            <li
              key={item.value}
              onClick={() => {
                setView(item.value);
                setOpen(false);
              }}
              className="
                p-3 rounded-lg cursor-pointer
                bg-gray-800
                hover:bg-blue-600
                hover:translate-x-1
                transition-all duration-200
              "
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}