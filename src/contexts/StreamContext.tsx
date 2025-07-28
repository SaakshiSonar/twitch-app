import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stream, StreamStats } from '../types';

interface StreamContextType {
  streams: Stream[];
  isStreaming: boolean;
  currentStream: Stream | null;
  streamStats: StreamStats;
  startStream: (streamData: Partial<Stream>) => void;
  stopStream: () => void;
  updateStreamInfo: (updates: Partial<Stream>) => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};

// Mock streams data
const mockStreams: Stream[] = [
  {
    id: '1',
    streamerId: '1',
    streamer: {
      id: '1',
      username: 'GamerPro',
      email: 'gamer@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'streamer',
      followers: 12500,
      following: 89,
      createdAt: '2023-01-15'
    },
    title: 'Speedrun World Record Attempt!',
    category: 'Speedrunning',
    tags: ['speedrun', 'world record', 'challenge'],
    thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewers: 1247,
    isLive: true,
    startedAt: '2024-01-20T14:30:00Z',
    language: 'English'
  },
  {
    id: '2',
    streamerId: '2',
    streamer: {
      id: '2',
      username: 'ArtisticSoul',
      email: 'artist@example.com',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'streamer',
      followers: 8934,
      following: 234,
      createdAt: '2022-11-08'
    },
    title: 'Digital Art Creation - Fantasy Landscape',
    category: 'Art',
    tags: ['digital art', 'fantasy', 'landscape', 'tutorial'],
    thumbnail: 'https://images.pexels.com/photos/1988681/pexels-photo-1988681.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewers: 567,
    isLive: true,
    startedAt: '2024-01-20T16:00:00Z',
    language: 'English'
  },
  {
    id: '3',
    streamerId: '3',
    streamer: {
      id: '3',
      username: 'MusicMaestro',
      email: 'music@example.com',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'streamer',
      followers: 15678,
      following: 123,
      createdAt: '2023-03-22'
    },
    title: 'Live Jazz Performance & Requests',
    category: 'Music',
    tags: ['jazz', 'live music', 'requests', 'piano'],
    thumbnail: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=400',
    viewers: 2134,
    isLive: true,
    startedAt: '2024-01-20T19:15:00Z',
    language: 'English'
  }
];

interface StreamProviderProps {
  children: ReactNode;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  const [streams] = useState<Stream[]>(mockStreams);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [streamStats, setStreamStats] = useState<StreamStats>({
    viewers: 0,
    chatMessages: 0,
    followers: 0,
    bitrate: 3500,
    quality: '1080p',
    uptime: '0:00:00'
  });

  const startStream = (streamData: Partial<Stream>) => {
    const newStream: Stream = {
      id: Date.now().toString(),
      streamerId: streamData.streamerId || '1',
      streamer: streamData.streamer || streams[0].streamer,
      title: streamData.title || 'Untitled Stream',
      category: streamData.category || 'Just Chatting',
      tags: streamData.tags || [],
      thumbnail: streamData.thumbnail || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      viewers: 0,
      isLive: true,
      startedAt: new Date().toISOString(),
      language: 'English'
    };

    setCurrentStream(newStream);
    setIsStreaming(true);
    setStreamStats(prev => ({ ...prev, viewers: 1 }));
  };

  const stopStream = () => {
    setCurrentStream(null);
    setIsStreaming(false);
    setStreamStats({
      viewers: 0,
      chatMessages: 0,
      followers: 0,
      bitrate: 3500,
      quality: '1080p',
      uptime: '0:00:00'
    });
  };

  const updateStreamInfo = (updates: Partial<Stream>) => {
    if (currentStream) {
      setCurrentStream({ ...currentStream, ...updates });
    }
  };

  return (
    <StreamContext.Provider value={{
      streams,
      isStreaming,
      currentStream,
      streamStats,
      startStream,
      stopStream,
      updateStreamInfo
    }}>
      {children}
    </StreamContext.Provider>
  );
};