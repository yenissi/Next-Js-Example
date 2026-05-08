"use client";

import { useState } from "react";

import Sidebar from "@/components/SideBar";
import Navbar from "@/components/Navbar";
import ProductsView from "@/components/views/ProductsView";
import AuthorsView from "@/components/views/AuthorsView";
import UsersView from "@/components/views/UsersView";
import ItemsView from "@/components/views/ItemsView";
import CartView from "@/components/views/CartItemsView";

type View = "products" | "authors" | "users" | "items" | "cart";

export default function Page() {
  const [view, setView] = useState<View>("products");
  const [open, setOpen] = useState(false);

  const views: Record<View, JSX.Element> = {
    products: <ProductsView />,
    authors: <AuthorsView />,
    users: <UsersView />,
    items: <ItemsView />,
    cart: <CartView />,
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <Navbar onOpenSidebar={() => setOpen(true)} />

      {/* SIDEBAR */}
      <Sidebar
        setView={setView}
        open={open}
        setOpen={setOpen}
      />

      {/* CONTENT */}
      <main className="flex-1 p-6 pt-20">
        {views[view]}
      </main>

    </div>
  );
}