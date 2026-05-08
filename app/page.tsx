"use client";

import { useState } from "react";
import Sidebar from "@/components/SideBar";
import ProductsView from "@/components/views/ProductsView";
import AuthorsView from "@/components/views/AuthorsView";
import UsersView from "@/components/views/UsersView";
import ItemsView from "@/components/views/ItemsView";
import CartView from "@/components/views/CartItemsView";

type View = "products" | "authors" | "users" | "items" | "cart";

export default function Page() {
  const [view, setView] = useState<View>("products");

  return (
    <div className="flex">
      <Sidebar setView={setView} />

      <div className="flex-1 p-6">
        {view === "products" && <ProductsView />}
        {view === "authors" && <AuthorsView />}
        {view === "users" && <UsersView />}
        {view === "items" && <ItemsView />}
        {view === "cart" && <CartView />}
      </div>
    </div>
  );
}