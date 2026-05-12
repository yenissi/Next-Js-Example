"use client";

import { useEffect, useState } from "react";
import { fetchAuthors } from "@/services/authors-service";
import type { Author } from "@/types/author";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AuthorsView() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const data = await fetchAuthors();
        setAuthors(data?.slice(0, 5) ?? []);
        setError(null);
      } catch {
        setError("Failed to load authors");
      } finally {
        setLoading(false);
      }
    }

    loadAuthors();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (loading) return <LoadingSkeleton type="authors" />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Users</h2>

      <div className="space-y-3">
        {authors.map((author, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={author.id}
              className="bg-white rounded-xl shadow-sm px-5 py-4 transition hover:shadow-md"
            >
              {/* HEADER */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-start justify-between cursor-pointer text-left"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    {author.firstName}
                  </p>
                </div>

                <div className="text-gray-500 mt-1">
                  {isOpen ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </button>

              {/* EXPAND CONTENT */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-20 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-sm text-gray-500">
                  Last Name: {author.lastName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}