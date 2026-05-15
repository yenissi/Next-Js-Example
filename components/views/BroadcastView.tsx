"use client";

import { useState } from "react";
import type { Broadcast } from "@/types/broadcast";
import { Button } from "@/components/ui/stateful-button";

export default function BroadcastView() {
  const [broadcast, setBroadcast] = useState<Broadcast>({
    title: "",
    message: "",
    schedule: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBroadcast({
      ...broadcast,
      [e.target.name]: e.target.value,
    });
  };

  // IMPORTANT: must return a Promise for StatefulButton
  const handleSend = () => {
    console.log("Broadcast Data:", broadcast);

    return new Promise((resolve) => {
      setTimeout(() => {
        alert("Broadcast sent!");
        resolve(true);
      }, 4000);
    });
  };

  return (
    <div className="p-2">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        
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
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={broadcast.title}
            onChange={handleChange}
            placeholder="Enter broadcast title..."
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message
          </label>

          <textarea
            name="message"
            value={broadcast.message}
            onChange={handleChange}
            rows={6}
            placeholder="Write your message here..."
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* SCHEDULE */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Schedule
          </label>

          <input
            type="datetime-local"
            name="schedule"
            value={broadcast.schedule}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* BUTTON (STATEFUL) */}
        <Button onClick={handleSend}>
          Send Now
        </Button>
      </div>
    </div>
  );
}