"use client";

import { useEffect, useState } from "react";
import { fetchActivities } from "@/services/activities-service";
import type { Activity } from "@/types/activity";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ActivitiesView() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ITEMS PER PAGE
  const [visibleCount, setVisibleCount] = useState("5");

  // CURRENT PAGE
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await fetchActivities();

        setActivities(data);
        setError(null);
      } catch (err) {
        setError("Failed to load activities");
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  // LOADING
  if (loading) {
    return <LoadingSkeleton type="activities" />;
  }

  // ERROR
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  // PAGINATION LOGIC
  const itemsPerPage =
    visibleCount === "" ? 1 : Number(visibleCount);

  const totalPages = Math.ceil(
    activities.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentActivities = activities.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="p-6">

      {/* TITLE + FILTER */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl font-bold">
          Activities
        </h2>

        {/* INPUT FILTER */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            Per Page:
          </label>

          <input
            type="number"
            min={1}
            value={visibleCount}
            onChange={(e) => {
              setVisibleCount(e.target.value);
              setCurrentPage(1);
            }}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black appearance-auto"
          />
        </div>
      </div>

      {/* ACTIVITIES LIST */}
      <ul className="space-y-3 max-w-2xl mx-auto">
        {currentActivities.map((a) => (
          <li
            key={a.id}
            className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <p className="font-semibold">
              {a.title}
            </p>

            <p className="text-gray-600 text-sm">
              {new Date(
                a.dueDate
              ).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-2 mt-6">

        {/* PREVIOUS */}
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          disabled={currentPage === 1}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Previous
        </button>

        {/* PAGE NUMBER */}
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        {/* NEXT */}
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

    </div>
  );
}