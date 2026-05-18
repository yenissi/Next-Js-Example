"use client";

import { useEffect, useState } from "react";
import type { Broadcast } from "@/types/broadcast";

import { Button } from "@/components/ui/stateful-button";
import { toast } from "sonner";

const STORAGE_KEY = "broadcast_events";

/* ✅ FORMAT DATE */
function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const fullDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${weekday}, ${fullDate} at ${time}`;
}

export default function BroadcastView() {
  const [broadcast, setBroadcast] = useState<
    Broadcast & {
      scheduleDate: string;
      scheduleTime: string;
    }
  >({
    title: "",
    message: "",
    schedule: "",
    scheduleDate: "",
    scheduleTime: "",
  });

  const [events, setEvents] = useState<any[]>([]);

  // =========================
  // LOAD EVENTS
  // =========================
  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    setEvents(stored);
  }, []);

  // =========================
  // AUTO CHECK EVENTS
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const now = new Date().getTime();

      const updated = stored.map((event: any) => {
        const eventTime = new Date(event.schedule).getTime();

        // ✅ SHOW TOAST WHEN TIME REACHED
        if (!event.triggered && now >= eventTime) {
          toast("📢 Scheduled Broadcast", {
            description: `${event.title} - ${event.message}`,
          });

          return {
            ...event,
            triggered: true,
          };
        }

        return event;
      });

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      setEvents(updated);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // SEND EVENT
  // =========================
  const handleSend = () => {
    const missing: string[] = [];

    if (!broadcast.title) missing.push("title");
    if (!broadcast.message) missing.push("schedule");
    if (!broadcast.scheduleDate) missing.push("date & time");

    if (missing.length > 0) {
      toast.error("Missing fields", {
        description: `Please input ${missing.join(", ")}.`,
      });

      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const combinedDateTime = new Date(
          `${broadcast.scheduleDate}T${broadcast.scheduleTime}`
        );

        const newEvent = {
          title: broadcast.title,
          message: broadcast.message,
          schedule: combinedDateTime.toISOString(),
          triggered: false,
          createdAt: new Date().toISOString(),
        };

        const existing = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        const updated = [...existing, newEvent];

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );

        setEvents(updated);

        toast("Broadcast scheduled", {
          description: formatDateTime(newEvent.schedule),

          action: {
            label: "Undo",

            onClick: () => {
              const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
              );

              const updated = stored.filter(
                (event: any) =>
                  event.createdAt !== newEvent.createdAt
              );

              localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updated)
              );

              setEvents(updated);

              toast.success("Broadcast removed");
            },
          },
        });

        // RESET
        setBroadcast({
          title: "",
          message: "",
          schedule: "",
          scheduleDate: "",
          scheduleTime: "",
        });

        resolve(true);
      }, 4000);
    });
  };

  return (
    <div className="fixed inset-0 mt-13 p-4 flex bg-gray-50 gap-6 overflow-hidden">

      {/* ================= LEFT ================= */}
      <div className="w-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Broadcast
          </h1>

          <p className="text-gray-500 mt-2">
            Send announcements and scheduled messages.
          </p>
        </div>

        {/* TITLE */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>

          <input
            value={broadcast.title}
            onChange={(e) =>
              setBroadcast({
                ...broadcast,
                title: e.target.value,
              })
            }
            placeholder="Enter title..."
            className="w-full border border-gray-300 bg-gray-50 p-3 rounded-2xl focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message
          </label>

          <textarea
            value={broadcast.message}
            onChange={(e) =>
              setBroadcast({
                ...broadcast,
                message: e.target.value,
              })
            }
            placeholder="Write your message..."
            rows={7}
            className="w-full border border-gray-300 bg-gray-50 p-3 rounded-2xl focus:ring-2 focus:ring-black outline-none transition resize-none"
          />
        </div>

        {/* DATETIME */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Schedule
          </label>

          <input
            type="datetime-local"
            value={
              broadcast.scheduleDate &&
              broadcast.scheduleTime
                ? `${broadcast.scheduleDate}T${broadcast.scheduleTime}`
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;

              const [date, time] = value.split("T");

              setBroadcast({
                ...broadcast,
                scheduleDate: date,
                scheduleTime: time,
              });
            }}
            className="w-full border border-gray-300 bg-gray-50 p-3 rounded-2xl focus:ring-2 focus:ring-black outline-none transition"
          />
        </div>

        {/* BUTTON */}
        <Button onClick={handleSend}>
          Send Now
        </Button>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="w-1/2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Scheduled Events
          </h2>

          <div className="text-sm text-gray-500">
            {events.length} Events
          </div>
        </div>

        {/* EVENTS */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">

          {events.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No scheduled events yet.
            </div>
          ) : (
            [...events]
              .sort(
                (a, b) =>
                  new Date(b.schedule).getTime() -
                  new Date(a.schedule).getTime()
              )
              .map((e, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-2xl p-5 bg-gray-50 shadow-sm"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between">

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {e.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1">
                        {e.message}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div
                      className={`text-xs font-semibold px-3 py-1 rounded-full ml-4 ${
                        e.triggered
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {e.triggered ? "Sent" : "Pending"}
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="mt-4 border-t pt-3 text-sm text-gray-500">
                    {formatDateTime(e.schedule)}
                  </div>
                </div>
              ))
          )}

        </div>
      </div>

    </div>
  );
}