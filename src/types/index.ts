export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  banner?: string;
  bio?: string;
  role: 'viewer' | 'streamer' | 'admin';
  followers: number;
  following: number;
  isFollowing?: boolean;
  createdAt: string;
}

export interface Stream {
  id: string;
  streamerId: string;
  streamer: User;
  title: string;
  category: string;
  tags: string[];
  thumbnail: string;
  viewers: number;
  isLive: boolean;
  startedAt: string;
  language: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
  isDeleted?: boolean;
  isModerator?: boolean;
  isStreamer?: boolean;
}

export interface StreamStats {
  viewers: number;
  chatMessages: number;
  followers: number;
  bitrate: number;
  quality: string;
  uptime: string;
}

export interface Category {
  id: string;
  name: string;
  thumbnail: string;
  viewers: number;
}