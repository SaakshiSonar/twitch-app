import React, { useState } from 'react';
import { Search, User, Settings, LogOut, Video, Gamepad2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('browse');
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Video className="w-8 h-8" />
              <span className="text-xl font-bold">StreamSpace</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onNavigate('browse')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'browse'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'categories'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Gamepad2 className="w-4 h-4 inline mr-1" />
              Categories
            </button>
            {user?.role === 'streamer' && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search streams, games, or streamers..."
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full border-2 border-gray-600"
                  />
                  <span className="hidden sm:block">{user?.username}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-600 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('settings');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <hr className="border-gray-600 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          onNavigate('home');
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('auth')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;