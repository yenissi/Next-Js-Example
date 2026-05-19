"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { fetchProducts } from "@/services/products-service";
import type { Product } from "@/types/product";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { GooeyInput } from "@/components/ui/gooey-input";

export default function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const { data, error } = useSWR("products", fetchProducts, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data) {
      setProducts(data.slice(0, 8));
    }
  }, [data]);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCard = (product: Product) => setActive(product);
  const closeCard = () => setActive(null);

  if (!data && !error) {
    return <LoadingSkeleton type="products" />;
  }

  if (error) {
    const isOnline = typeof navigator !== "undefined" && navigator.onLine;

    return (
      <p className="text-red-500 text-lg fixed inset-0 flex items-center justify-center text-center px-4">
        {isOnline
          ? "Failed to load products"
          : "You are offline. Please check your connection or try again later."}
      </p>
    );
  }

  return (
    <>
      {/* MAIN CONTAINER */}
      <div className="fixed inset-0 bg-gray-100 flex justify-center pt-18 overflow-hidden">

        <div className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-xl p-6 flex flex-col mt-6">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-5">

            <h2 className="text-2xl font-bold whitespace-nowrap">
              Products
            </h2>

            {/* SEARCH RIGHT */}
            <div className="flex justify-end ml-auto">
              <div className="w-full max-w-md">
                <GooeyInput
                  placeholder="Search products..."
                  defaultValue={search}
                  onValueChange={setSearch}
                  className="w-full"
                />
              </div>
            </div>

          </div>

          {/* PRODUCT LIST */}
          <div className="flex-1 overflow-y-auto pr-2">

            {filteredProducts.length > 0 ? (
              <ul className="max-w-3xl mx-auto w-full flex flex-col gap-4">

                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layoutId={`card-${product.id}`}
                    onClick={() => openCard(product)}
                    className="p-4 flex flex-col md:flex-row justify-between items-center border rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  >

                    {/* LEFT SIDE */}
                    <div className="flex flex-col md:flex-row gap-4">

                      <motion.img
                        layoutId={`image-${product.id}`}
                        src={product.images?.[0]}
                        alt={product.title}
                        className="h-40 w-full md:h-20 md:w-20 rounded-xl object-cover"
                      />

                      <div className="flex flex-col justify-center">

                        <motion.h3
                          layoutId={`title-${product.id}`}
                          className="font-semibold text-black"
                        >
                          {product.title}
                        </motion.h3>

                        <motion.p
                          layoutId={`price-${product.id}`}
                          className="text-gray-600 mt-1"
                        >
                          ${product.price}
                        </motion.p>

                      </div>

                    </div>

                    <motion.button
                      layoutId={`button-${product.id}`}
                      className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-black text-white text-sm font-medium cursor-pointer"
                    >
                      View
                    </motion.button>

                  </motion.div>
                ))}

              </ul>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No products found
              </p>
            )}

          </div>
        </div>
      </div>

      {/* EXPANDABLE MODAL */}
      <AnimatePresence>
        {active && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeCard}
            />

            {/* MODAL */}
            <div className="fixed inset-0 z-50 grid place-items-center p-4">

              <motion.div
                layoutId={`card-${active.id}`}
                className="w-full max-w-[600px] bg-white rounded-2xl overflow-hidden shadow-2xl"
              >

                <motion.img
                  layoutId={`image-${active.id}`}
                  src={active.images?.[0]}
                  className="w-full h-80 object-cover"
                />

                <div className="p-6">

                  <div className="flex items-start justify-between">

                    <div>

                      <motion.h3
                        layoutId={`title-${active.id}`}
                        className="text-2xl font-bold"
                      >
                        {active.title}
                      </motion.h3>

                      <motion.p
                        layoutId={`price-${active.id}`}
                        className="text-gray-600 mt-2"
                      >
                        ${active.price}
                      </motion.p>

                    </div>

                    <button 
                      onClick={closeCard}
                      className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        
                        <X />
                    </button>

                  </div>

                  <p className="text-gray-600 mt-6 leading-relaxed">
                    {active.description}
                  </p>

                  <motion.button
                    layoutId={`button-${active.id}`}
                    className="mt-6 px-5 py-2 rounded-full bg-black text-white font-medium cursor-pointer"
                  >
                    View Product
                  </motion.button>

                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}