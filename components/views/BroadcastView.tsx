"use client";

import { useEffect, useState } from "react";
import type { Broadcast } from "@/types/broadcast";

import { Button } from "@/components/ui/stateful-button";
import { toast } from "sonner";

const STORAGE_KEY = "broadcast_events";

/* ✅ format */
function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  return date
    .toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(",", " at");
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
  // LOAD EVENTS ON MOUNT
  // =========================
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setEvents(stored);
  }, []);

  // =========================
  // AUTO CHECK SCHEDULED EVENTS
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      const now = new Date().getTime();

      const updated = stored.map((event: any) => {
        const eventTime = new Date(event.schedule).getTime();

        // ✅ if time reached AND not triggered yet
        if (!event.triggered && now >= eventTime) {
          toast("📢 Scheduled Broadcast", {
            description: `${event.title} - ${event.message}`,
          });

          return { ...event, triggered: true };
        }

        return event;
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEvents(updated);
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // =========================
  // SEND EVENT
  // =========================
  const handleSend = () => {
    const missing: string[] = [];

    if (!broadcast.title) missing.push("title");
    if (!broadcast.message) missing.push("message");
    if (!broadcast.scheduleDate) missing.push("date");
    if (!broadcast.scheduleTime) missing.push("time");

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
          triggered: false, // ✅ IMPORTANT
          createdAt: new Date().toISOString(),
        };

        const existing = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        const updated = [...existing, newEvent];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setEvents(updated);

        toast("Broadcast scheduled", {
          description: formatDateTime(newEvent.schedule),
        });

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

    {/* ================= LEFT: FORM ================= */}
    <div className="w-1/2 bg-white rounded-xl shadow-lg border border-gray-100 p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Broadcast
        </h1>
        <p className="text-gray-500 mt-2">
          Send announcements and scheduled messages.
        </p>
      </div>

      {/* TITLE */}
      <input
        className="w-full mb-4 border border-gray-300 p-3 rounded-xl"
        value={broadcast.title}
        onChange={(e) =>
          setBroadcast({ ...broadcast, title: e.target.value })
        }
        placeholder="Title"
      />

      {/* MESSAGE */}
      <textarea
        className="w-full mb-4 border border-gray-300 p-3 rounded-xl"
        value={broadcast.message}
        onChange={(e) =>
          setBroadcast({ ...broadcast, message: e.target.value })
        }
        placeholder="Message"
        rows={6}
      />

      {/* DATE + TIME */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={broadcast.scheduleDate}
          onChange={(e) =>
            setBroadcast({
              ...broadcast,
              scheduleDate: e.target.value,
            })
          }
          className="w-1/2 border border-gray-300 p-3 rounded-xl"
        />

        <input
          type="time"
          value={broadcast.scheduleTime}
          onChange={(e) =>
            setBroadcast({
              ...broadcast,
              scheduleTime: e.target.value,
            })
          }
          className="w-1/2 border border-gray-300 p-3 rounded-xl"
        />
      </div>

      <Button onClick={handleSend}>
        Send Now
      </Button>
    </div>

    {/* ================= RIGHT: EVENTS ================= */}
    <div className="w-1/2 bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col">

      <h2 className="text-xl font-bold mb-4">
        Scheduled Events
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">

        {events.length === 0 ? (
          <p className="text-gray-500">
            No scheduled events yet.
          </p>
        ) : (
          events.map((e, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50"
            >
              <div className="font-semibold text-gray-900">
                {e.title}
              </div>

              <div className="text-sm text-gray-600">
                {e.message}
              </div>

              <div className="text-xs text-gray-500 mt-2">
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