import React from 'react';
import StreamPlayer from './StreamPlayer';
import Chat from './Chat';
import { Stream } from '../types';

interface StreamViewPageProps {
  stream: Stream;
  onBack: () => void;
}

const StreamViewPage: React.FC<StreamViewPageProps> = ({ stream, onBack }) => {
  const handleFollow = () => {
    // Handle follow functionality
    console.log('Following', stream.streamer.username);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
        >
          ← Back to Browse
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 lg:flex-[1.2] p-6">
          <StreamPlayer stream={stream} onFollow={handleFollow} />
          
          {/* Stream Info */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">About this stream</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Streamer</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={stream.streamer.avatar}
                    alt={stream.streamer.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{stream.streamer.username}</p>
                    <p className="text-gray-400 text-sm">{stream.streamer.followers?.toLocaleString()} followers</p>
                  </div>
                </div>
                
                {stream.streamer.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Bio</h4>
                    <p className="text-gray-300 text-sm">{stream.streamer.bio}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Stream Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white">{stream.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white">{stream.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Started:</span>
                    <span className="text-white">
                      {new Date(stream.startedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                {stream.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {stream.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 h-64 lg:h-full">
          <Chat streamId={stream.id} />
        </div>
      </div>
    </div>
  );
};

export default StreamViewPage;