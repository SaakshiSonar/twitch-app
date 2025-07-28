import React, { useState } from 'react';
import Header from './components/Header';
import StreamCard from './components/StreamCard';
import AuthPage from './components/AuthPage';
import BrowsePage from './components/BrowsePage';
import StreamViewPage from './components/StreamViewPage';
import StreamingDashboard from './components/StreamingDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { StreamProvider } from './contexts/StreamContext';
import { Stream } from './types';
import { useStream } from './contexts/StreamContext';
import { TrendingUp, Users, Video, Play, Gamepad2 } from 'lucide-react';

const HomePage: React.FC<{ onWatchStream: (stream: Stream) => void; onNavigate: (page: string) => void }> = ({ onWatchStream, onNavigate }) => {
  const { streams } = useStream();
  
  const featuredStreams = streams.slice(0, 3);
  const popularStreams = streams.slice().sort((a, b) => b.viewers - a.viewers).slice(0, 6);
  const totalViewers = streams.reduce((sum, stream) => sum + stream.viewers, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Welcome to <span className="text-purple-300">StreamSpace</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Discover amazing live streams, connect with your favorite creators, and join a vibrant community of viewers and streamers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('browse')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Watching
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="bg-transparent border-2 border-purple-300 text-purple-300 hover:bg-purple-300 hover:text-purple-900 px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
              >
                <Video className="w-5 h-5 mr-2" />
                Join Community
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-purple-400 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-indigo-400 rounded-full opacity-20 blur-3xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-200">
          <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{totalViewers.toLocaleString()}</h3>
          <p className="text-gray-400">Active Viewers</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-200">
          <Video className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">{streams.length}</h3>
          <p className="text-gray-400">Live Streams</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 text-center transform hover:scale-105 transition-all duration-200">
          <Gamepad2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">50+</h3>
          <p className="text-gray-400">Categories</p>
        </div>
      </div>

      {/* Featured Streams */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-400" />
            Featured Streams
          </h2>
          <button
            onClick={() => onNavigate('browse')}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStreams.map(stream => (
            <StreamCard
              key={stream.id}
              stream={stream}
              onClick={() => onWatchStream(stream)}
            />
          ))}
        </div>
      </section>

      {/* Popular Streams */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Users className="w-6 h-6 mr-2 text-green-400" />
            Most Popular
          </h2>
          <button
            onClick={() => onNavigate('browse')}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularStreams.map(stream => (
            <StreamCard
              key={stream.id}
              stream={stream}
              onClick={() => onWatchStream(stream)}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Streaming?</h2>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
          Join thousands of creators who are already building their community on StreamSpace. 
          Start your streaming journey today and connect with viewers worldwide.
        </p>
        <button
          onClick={() => onNavigate('auth')}
          className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);

  const handleWatchStream = (stream: Stream) => {
    setSelectedStream(stream);
    setCurrentPage('watch');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'watch') {
      setSelectedStream(null);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'browse':
        return <BrowsePage onWatchStream={handleWatchStream} />;
      case 'watch':
        return selectedStream ? (
          <StreamViewPage 
            stream={selectedStream} 
            onBack={() => handleNavigate('browse')} 
          />
        ) : (
          <HomePage onWatchStream={handleWatchStream} onNavigate={handleNavigate} />
        );
      case 'dashboard':
        return <StreamingDashboard />;
      case 'categories':
        return <BrowsePage onWatchStream={handleWatchStream} />;
      default:
        return <HomePage onWatchStream={handleWatchStream} onNavigate={handleNavigate} />;
    }
  };

  const showHeader = currentPage !== 'auth' && currentPage !== 'watch';

  return (
    <AuthProvider>
      <StreamProvider>
        <div className="min-h-screen bg-gray-900">
          {showHeader && (
            <Header onNavigate={handleNavigate} currentPage={currentPage} />
          )}
          {renderCurrentPage()}
        </div>
      </StreamProvider>
    </AuthProvider>
  );
}

export default App;