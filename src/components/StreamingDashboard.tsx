import React, { useState } from 'react';
import { Play, Square, Settings, Users, MessageSquare, TrendingUp, Camera, Mic, Video } from 'lucide-react';
import { useStream } from '../contexts/StreamContext';
import { useAuth } from '../contexts/AuthContext';

const StreamingDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isStreaming, currentStream, streamStats, startStream, stopStream, updateStreamInfo } = useStream();
  const [streamTitle, setStreamTitle] = useState('');
  const [streamCategory, setStreamCategory] = useState('Just Chatting');
  const [streamTags, setStreamTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);

  const categories = [
    'Just Chatting',
    'Gaming',
    'Music',
    'Art',
    'Sports',
    'Technology',
    'Cooking',
    'Fitness',
    'Education',
    'Entertainment'
  ];

  const handleStartStream = async () => {
    if (!streamTitle.trim()) {
      alert('Please enter a stream title');
      return;
    }

    setIsSettingUp(true);
    
    // Simulate stream setup delay
    setTimeout(() => {
      startStream({
        streamerId: user?.id,
        streamer: user,
        title: streamTitle,
        category: streamCategory,
        tags: streamTags,
        thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'
      });
      setIsSettingUp(false);
    }, 2000);
  };

  const handleStopStream = () => {
    stopStream();
  };

  const addTag = () => {
    if (newTag.trim() && !streamTags.includes(newTag.trim()) && streamTags.length < 5) {
      setStreamTags([...streamTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setStreamTags(streamTags.filter(tag => tag !== tagToRemove));
  };

  if (user?.role !== 'streamer') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You need to be a verified streamer to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Streaming Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-gray-400">
            {isStreaming ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stream Setup */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Stream Setup
            </h2>
            
            {!isStreaming ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stream Title *
                  </label>
                  <input
                    type="text"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    placeholder="What are you streaming today?"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    maxLength={140}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={streamCategory}
                    onChange={(e) => setStreamCategory(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (Max 5)
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button
                      onClick={addTag}
                      disabled={streamTags.length >= 5}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {streamTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {streamTags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-400 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartStream}
                  disabled={isSettingUp || !streamTitle.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center"
                >
                  {isSettingUp ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Setting up stream...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Streaming
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-md p-4">
                  <h3 className="text-white font-medium mb-2">{currentStream?.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{currentStream?.category}</span>
                    <span>{streamStats.viewers} viewers</span>
                    <span>Uptime: {streamStats.uptime}</span>
                  </div>
                </div>

                <button
                  onClick={handleStopStream}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-md transition-colors flex items-center justify-center"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop Streaming
                </button>
              </div>
            )}
          </div>

          {/* Stream Preview */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Stream Preview
            </h2>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              {isStreaming ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-medium">Live Stream Active</p>
                  <p className="text-gray-400 text-sm">Broadcasting in {streamStats.quality}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Stream preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Stats & Tools */}
        <div className="space-y-6">
          {/* Live Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Live Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  Viewers
                </div>
                <span className="text-white font-medium">{streamStats.viewers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat Messages
                </div>
                <span className="text-white font-medium">{streamStats.chatMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Followers</span>
                <span className="text-white font-medium">{streamStats.followers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Bitrate</span>
                <span className="text-white font-medium">{streamStats.bitrate} kbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Quality</span>
                <span className="text-white font-medium">{streamStats.quality}</span>
              </div>
              {isStreaming && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Uptime</span>
                  <span className="text-white font-medium">{streamStats.uptime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Quick Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Microphone</span>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Camera</span>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Screen Share</span>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded transition-colors">
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-400">New follower: @newviewer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-400">Chat message from @regularfan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-gray-400">Stream quality improved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingDashboard;