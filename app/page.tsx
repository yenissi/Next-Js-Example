"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/SideBar";
import Navbar from "@/components/Navbar";

import ProductsView from "@/components/views/ProductsView";
import AuthorsView from "@/components/views/AuthorsView";
import ActivitiesView from "@/components/views/ActivitiesView";
import ItemsView from "@/components/views/ItemsView";
import CartView from "@/components/views/CartItemsView";
import VideosView from "@/components/views/VideosView";
import BroadcastView from "@/components/views/BroadcastView";

type View =
  | "products"
  | "authors"
  | "activities"
  | "items"
  | "cart"
  | "videos"
  | "broadcast";

export default function Page() {
  const [view, setView] = useState<View>("products");
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  // run ONLY on client after mount
  useEffect(() => {
    const savedView = localStorage.getItem("activeView") as View | null;

    if (savedView) {
      setView(savedView);
    }

    setHydrated(true);
  }, []);

  const handleViewChange = (v: View) => {
    setView(v);
    localStorage.setItem("activeView", v);
    setOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case "products":
        return <ProductsView />;
      case "authors":
        return <AuthorsView />;
      case "activities":
        return <ActivitiesView />;
      case "items":
        return <ItemsView />;
      case "cart":
        return <CartView />;
      case "videos":
        return <VideosView />;
      case "broadcast":
        return <BroadcastView />;
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

      <div className="flex-1 flex flex-col">
        {/* NAVBAR always visible */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar onOpenSidebar={() => setOpen((p) => !p)} />
        </div>

        {/* CONTENT */}
        <main className="pt-20 p-6">
          {hydrated ? renderView() : null}
        </main>
      </div>
    </div>
  );
}