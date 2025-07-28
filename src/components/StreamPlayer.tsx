import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Users, Heart } from 'lucide-react';
import { Stream } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface StreamPlayerProps {
  stream: Stream;
  onFollow?: () => void;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ stream, onFollow }) => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [showControls, setShowControls] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Initialize video source only once on mount
  useEffect(() => {
    if (videoRef.current) {
      // In a real implementation, this would establish WebRTC connection
      videoRef.current.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      videoRef.current.loop = true;
    }
  }, []);

  // Handle playback and mute state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleFollow = () => {
    if (onFollow) {
      onFollow();
      setIsFollowing(!isFollowing);
    }
  };

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video Player */}
      <div
        className="relative aspect-video group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
        />
        
        {/* Live Indicator */}
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
          LIVE
        </div>

        {/* Viewer Count */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {formatViewers(stream.viewers)}
        </div>

        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="bg-black bg-opacity-75 text-white text-sm rounded px-2 py-1 border border-gray-600"
                  >
                    <option value="1080p">1080p</option>
                    <option value="720p">720p</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <div className="p-4 bg-gray-900">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={stream.streamer.avatar}
              alt={stream.streamer.username}
              className="w-12 h-12 rounded-full flex-shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">{stream.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="font-medium text-purple-400">{stream.streamer.username}</span>
                <span>{stream.category}</span>
                <span>{formatViewers(stream.viewers)} viewers</span>
              </div>
              {stream.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {stream.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {user && user.id !== stream.streamerId && (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center ${
                isFollowing
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;