import { videosData } from "./videos-data";
import type { Video } from "@/types/video";

export const fetchVideos = async (): Promise<Video[]> => {
  return Promise.resolve(videosData);
};