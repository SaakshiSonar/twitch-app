import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { Stream } from '../types';

interface StreamCardProps {
  stream: Stream;
  onClick: () => void;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream, onClick }) => {
  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getStreamDuration = (startedAt: string) => {
    const start = new Date(startedAt);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200 hover:shadow-xl group"
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full h-48 object-cover"
        />
        {stream.isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            LIVE
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          {formatViewers(stream.viewers)}
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {getStreamDuration(stream.startedAt)}
        </div>
      </div>

      {/* Stream Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={stream.streamer.avatar}
            alt={stream.streamer.username}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
              {stream.title}
            </h3>
            <p className="text-gray-400 text-sm truncate">
              {stream.streamer.username}
            </p>
            <p className="text-gray-500 text-sm">
              {stream.category}
            </p>
            {stream.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {stream.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {stream.tags.length > 2 && (
                  <span className="text-gray-500 text-xs">
                    +{stream.tags.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;