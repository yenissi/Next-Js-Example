"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import Sidebar from "@/components/SideBar";
import Navbar from "@/components/Navbar";
import ProductsView from "@/components/views/ProductsView";
import AuthorsView from "@/components/views/AuthorsView";
import UsersView from "@/components/views/UsersView";
import ItemsView from "@/components/views/ItemsView";
import CartView from "@/components/views/CartItemsView";
import VideosView from "@/components/views/VideosView";

type View = "products" | "authors" | "users" | "items" | "cart" | "videos";

export default function Page() {
  const [view, setView] = useState<View>("products"); // 👈 TEMP: set products to test
  const [open, setOpen] = useState(false);

  const views: Record<View, ReactNode> = {
    products: <ProductsView />,
    authors: <AuthorsView />,
    users: <UsersView />,
    items: <ItemsView />,
    cart: <CartView />,
    videos: <VideosView />,
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR (fixed) */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onOpenSidebar={() => setOpen(true)} />
      </div>

      {/* SIDEBAR */}
      <Sidebar
        setView={setView}
        open={open}
        setOpen={setOpen}
      />

      {/* CONTENT */}
      <main className="pt-20 p-6">
        {views[view]}
      </main>

    </div>
  );
}