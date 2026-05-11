export type Video = {
  id: number;
  title: string;
  thumbnail: string;
  url: string;

  // NEW (YouTube style)
  duration?: string;
  channel?: string;
  channelAvatar?: string;
  views?: string;
  uploaded?: string;
};