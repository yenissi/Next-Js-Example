"use client";

import { useEffect, useState } from "react";
import { fetchAuthors } from "@/services/authors-service";
import type { Author } from "@/types/author";

export default function AuthorsView() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAuthors() {
      try {
        setLoading(true);

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

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="w-10 h-10 border-4 border-t-gray-900 border-gray-300 rounded-full animate-spin"></div>
    </div>;
  }

  if (error) {
    return <p className="text-red-500 text-lg fixed inset-0 flex items-center justify-center">{error}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Authors</h2>
      </div>
      
      <ul className="space-y-2">
        {authors.map((a) => (
          <li key={a.id} className="p-2 bg-gray-100 rounded">
            {a.firstName} {a.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}