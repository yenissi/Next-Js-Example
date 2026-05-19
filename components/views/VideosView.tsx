"use client";

import { useEffect, useState } from "react";
import { fetchVideos } from "@/services/videos-service";
import type { Video } from "@/types/video";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { GooeyInput } from "@/components/ui/gooey-input";

export default function VideosView() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchVideos();
        setVideos(data ?? []);
      } catch {
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredVideos = videos.filter((video) =>
    `${video.title} ${video.channel ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <LoadingSkeleton type="videos" />;

  if (error) {
    return (
      <p className="text-red-500 text-lg flex items-center justify-center min-h-screen">
        {error}
      </p>
    );
  }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-7xl">

        {/* SEARCH (RIGHT SIDE) */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md">

            <GooeyInput
              placeholder="Search videos..."
              defaultValue={search}
              onValueChange={setSearch}
              className="w-full justify-end"
            />

          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col h-full group"
              >
                {/* THUMBNAIL */}
                <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="flex gap-3 mt-3 flex-1">
                  <img
                    src={video.channelAvatar}
                    alt={video.channel ?? "channel"}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex flex-col">
                    <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
                      {video.title}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      {video.channel}
                    </p>

                    <p className="text-xs text-gray-500">
                      {video.views} • {video.uploaded}
                    </p>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No videos found
            </p>
          )}

        </div>
      </div>
    </div>
  );
}