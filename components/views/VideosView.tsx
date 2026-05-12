"use client";

import { useEffect, useState } from "react";
import { fetchVideos } from "@/services/videos-service";
import type { Video } from "@/types/video";
import LoadingSpinner from "@/components/LoadingSkeleton";
import { Search } from "lucide-react";

export default function VideosView() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchVideos();
        setVideos(data);
      } catch (err) {
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <p className="text-red-500 text-lg fixed inset-0 flex items-center justify-center">
        {error}
      </p>
    );
  }

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      video.channel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-8xl">

        {/* 🔍 SEARCH BAR */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xl group">

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black">
              <Search size={18} />
            </span>

            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* 📺 VIDEO GRID (FIXED ALIGNMENT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">

          {filteredVideos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="w-full max-w-sm group flex flex-col h-full"
            >

              {/* THUMBNAIL */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
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
              <div className="flex gap-3 mt-3">
                <img
                  src={video.channelAvatar}
                  alt={video.channel}
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
          ))}

        </div>
      </div>
    </div>
  );
}