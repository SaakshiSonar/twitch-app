import React, { useState, useRef, useEffect } from 'react';
import { Send, Settings, Shield, Clock, Ban, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ChatProps {
  streamId: string;
  isStreamer?: boolean;
}

const Chat: React.FC<ChatProps> = ({ streamId, isStreamer = false }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [slowMode, setSlowMode] = useState(false);
  const [slowModeDelay, setSlowModeDelay] = useState(30);
  const [showModerationPanel, setShowModerationPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial messages
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        userId: '1',
        username: 'ChatUser1',
        message: 'Great stream! Love the content!',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        userId: '2',
        username: 'GamerFan',
        message: 'First time watching, really enjoying it!',
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        id: '3',
        userId: '3',
        username: 'RegularViewer',
        message: 'Been following for months, keep up the awesome work!',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        isModerator: true,
      },
    ];
    setMessages(mockMessages);
  }, [streamId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isStreamer: isStreamer,
      isModerator: user.role === 'admin',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isDeleted: true } : msg
      )
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSlowMode = () => {
    setSlowMode(!slowMode);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-medium">Stream Chat</h3>
        </div>
        {(isStreamer || user?.role === 'admin') && (
          <div className="flex items-center space-x-2">
            {slowMode && (
              <div className="flex items-center text-orange-400 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                {slowModeDelay}s
              </div>
            )}
            <button
              onClick={() => setShowModerationPanel(!showModerationPanel)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Moderation Panel */}
      {showModerationPanel && (isStreamer || user?.role === 'admin') && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Moderation Tools</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSlowMode}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                slowMode
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Slow Mode
            </button>
            <select
              value={slowModeDelay}
              onChange={(e) => setSlowModeDelay(Number(e.target.value))}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
              disabled={!slowMode}
            >
              <option value={30}>30s</option>
              <option value={60}>1m</option>
              <option value={120}>2m</option>
              <option value={300}>5m</option>
            </select>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`group relative ${message.isDeleted ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start space-x-2">
              <span className="text-gray-500 text-xs flex-shrink-0 mt-1">
                {formatTime(message.timestamp)}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={`font-medium mr-2 ${
                    message.isStreamer
                      ? 'text-purple-400'
                      : message.isModerator
                      ? 'text-green-400'
                      : 'text-blue-400'
                  }`}
                >
                  {message.isStreamer && <Shield className="w-3 h-3 inline mr-1" />}
                  {message.isModerator && !message.isStreamer && (
                    <Shield className="w-3 h-3 inline mr-1" />
                  )}
                  {message.username}:
                </span>
                <span className={`text-white ${message.isDeleted ? 'line-through' : ''}`}>
                  {message.isDeleted ? 'Message deleted' : message.message}
                </span>
              </div>
              {(isStreamer || user?.role === 'admin') && !message.isDeleted && (
                <button
                  onClick={() => deleteMessage(message.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                >
                  <Ban className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      {user ? (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{newMessage.length}/500</span>
            {slowMode && (
              <span className="text-orange-400">
                Slow mode: {slowModeDelay}s between messages
              </span>
            )}
          </div>
        </form>
      ) : (
        <div className="p-4 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">Sign in to join the chat</p>
        </div>
      )}
    </div>
  );
};

export default Chat;