"use client";

import { useState } from "react";

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
  const [view, setView] = useState<View>("products");
  const [open, setOpen] = useState(false);

  const handleViewChange = (v: View) => {
    setView(v);
    setOpen(false); // close sidebar after navigation
  };

  const renderView = () => {
    switch (view) {
      case "products":
        return <ProductsView />;
      case "authors":
        return <AuthorsView />;
      case "users":
        return <UsersView />;
      case "items":
        return <ItemsView />;
      case "cart":
        return <CartView />;
      case "videos":
        return <VideosView />;
      default:
        return <ProductsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <Sidebar
        setView={handleViewChange}
        open={open}
        setOpen={setOpen}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar onOpenSidebar={() => setOpen(true)} />
        </div>

        {/* CONTENT */}
        <main className="pt-20 p-6">
          {renderView()}
        </main>

      </div>
    </div>
  );
}