import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Users, Clock } from 'lucide-react';
import StreamCard from './StreamCard';
import { useStream } from '../contexts/StreamContext';
import { Stream, Category } from '../types';

interface BrowsePageProps {
  onWatchStream: (stream: Stream) => void;
}

const BrowsePage: React.FC<BrowsePageProps> = ({ onWatchStream }) => {
  const { streams } = useStream();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('viewers');
  const [showFilters, setShowFilters] = useState(false);

  const categories: Category[] = [
    { id: 'all', name: 'All Categories', thumbnail: '', viewers: streams.length },
    { id: 'gaming', name: 'Gaming', thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300', viewers: 1247 },
    { id: 'art', name: 'Art', thumbnail: 'https://images.pexels.com/photos/1988681/pexels-photo-1988681.jpeg?auto=compress&cs=tinysrgb&w=300', viewers: 567 },
    { id: 'music', name: 'Music', thumbnail: 'https://images.pexels.com/photos/210922/pexels-photo-210922.jpeg?auto=compress&cs=tinysrgb&w=300', viewers: 2134 },
    { id: 'chatting', name: 'Just Chatting', thumbnail: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=300', viewers: 3456 },
    { id: 'technology', name: 'Technology', thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300', viewers: 892 }
  ];

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.streamer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           stream.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory && stream.isLive;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'viewers':
        return b.viewers - a.viewers;
      case 'recent':
        return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const totalViewers = streams.reduce((sum, stream) => sum + stream.viewers, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Browse Live Streams</h1>
          <div className="flex items-center space-x-4 text-gray-400">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {totalViewers.toLocaleString()} viewers
            </span>
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {filteredStreams.length} live channels
            </span>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search streams, games, or streamers..."
            className="w-full bg-gray-800 border border-gray-600 rounded-md pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {showFilters && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="viewers">Most Viewers</option>
                  <option value="recent">Recently Started</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSortBy('viewers');
                  }}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(1).map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <img
                src={category.thumbnail}
                alt={category.name}
                className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-white text-sm font-medium truncate">{category.name}</h3>
                <p className="text-gray-300 text-xs">{category.viewers.toLocaleString()} viewers</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Live Streams */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {selectedCategory === 'all' ? 'Live Streams' : `${categories.find(c => c.id === selectedCategory)?.name} Streams`}
          </h2>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Updated live
          </div>
        </div>

        {filteredStreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStreams.map(stream => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onClick={() => onWatchStream(stream)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No streams found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No live streams available at the moment'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;