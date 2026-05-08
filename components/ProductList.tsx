"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { fetchProducts } from "@/services/products-service";
import { Search } from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      const sliced = data.slice(0, 8);
      setProducts(sliced);
    }

    load();
  }, []);

  if (!products.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const openModal = (product: Product) => {
    setSelected(product);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelected(null);
  };

  // 🔍 FILTER
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-100 flex justify-center pt-18 overflow-hidden">
      
      {/* MAIN CARD */}
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-xl p-6 flex flex-col mt-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          
          <h2 className="text-2xl font-bold">Products</h2>

          {/* SEARCH */}
          <div className="relative w-[200px]">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <span className="font-medium">{product.title}</span>

                <button
                  onClick={() => openModal(product)}
                  className="px-3 py-1 text-sm bg-black text-white rounded cursor-pointer hover:bg-gray-800"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No products found
            </p>
          )}
        </div>
      </div>

      {/* MODAL */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          
          <div className="bg-white w-[500px] rounded-xl shadow-xl p-8 relative">
            
            <button
              onClick={closeModal}
              className="absolute top-1 right-3 text-xl cursor-pointer"
            >
              ✕
            </button>

            <img
              src={selected.images?.[0]}
              className="h-56 w-full object-cover rounded-lg mb-4"
            />

            <h2 className="text-xl font-bold mb-2">
              {selected.title}
            </h2>

            <p className="text-gray-600 mb-3">
              {selected.description}
            </p>

            <p className="text-lg font-semibold text-green-600">
              ${selected.price}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}