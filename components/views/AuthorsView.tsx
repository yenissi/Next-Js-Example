"use client";

import { useEffect, useState } from "react";
import { fetchAuthors } from "@/services/authors-service";
import type { Author } from "@/types/author";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AuthorsView() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthors() {
      try {
        const data = await fetchAuthors();

        setAuthors(data.slice(0, 5));

        setError(null);
      } catch (err) {
        setError("Failed to load authors");
      } finally {
        setLoading(false);
      }
    }

    loadAuthors();
  }, []);

  // LOADING
  if (loading) {
    return <LoadingSpinner />;
  }

  // ERROR
  if (error) {
    return (
      <p className="text-red-500 text-lg fixed inset-0 flex items-center justify-center">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6">
      
      {/* TITLE */}
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold">Authors</h2>
      </div>

      {/* AUTHORS LIST */}
      <ul className="space-y-3 max-w-xl mx-auto">
        {authors.map((a) => (
          <li
            key={a.id}
            className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            {a.firstName} {a.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}