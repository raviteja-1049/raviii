import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Activity, Bell, X } from 'lucide-react';
import { useRealtime } from '../hooks/useRealtime';
import { usePostgresChanges } from '../hooks/usePostgresChanges';

interface RealtimeCollaborationProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RealtimeCollaboration({ projectId, isOpen, onClose }: RealtimeCollaborationProps) {
  const { presenceState, messages, isConnected, sendMessage, updatePresence } = useRealtime(projectId);
  const { changes, isListening } = usePostgresChanges(['recipes', 'taste_predictions', 'projects']);
  const [activeTab, setActiveTab] = useState<'presence' | 'messages' | 'activity'>('presence');
  const [newMessage, setNewMessage] = useState('');

  const onlineUsers = Object.values(presenceState).filter(user => user.status === 'online');

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage('collaboration_request', {
      message: newMessage,
      type: 'chat'
    });
    
    setNewMessage('');
  };

  const handleStatusChange = (status: 'online' | 'away') => {
    updatePresence(status);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-40">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="font-semibold text-gray-900">Live Collaboration</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('presence')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'presence' 
              ? 'text-emerald-600 border-b-2 border-emerald-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users className="h-4 w-4 inline mr-1" />
          Users ({onlineUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'messages' 
              ? 'text-emerald-600 border-b-2 border-emerald-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageCircle className="h-4 w-4 inline mr-1" />
          Chat ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'activity' 
              ? 'text-emerald-600 border-b-2 border-emerald-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Activity className="h-4 w-4 inline mr-1" />
          Activity
        </button>
      </div>

      <div className="h-80 overflow-y-auto">
        {activeTab === 'presence' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Your Status</span>
              <select 
                onChange={(e) => handleStatusChange(e.target.value as 'online' | 'away')}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="online">Online</option>
                <option value="away">Away</option>
              </select>
            </div>
            
            {onlineUsers.map((user) => (
              <div key={user.user_id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-medium text-sm">
                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {user.full_name || user.email}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-xs text-gray-500 capitalize">{user.status}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {onlineUsers.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                No other users online
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {message.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-800">
                    {message.payload.message || JSON.stringify(message.payload)}
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  No messages yet
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">Database Changes</span>
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            {changes.map((change, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    change.eventType === 'INSERT' ? 'bg-green-100 text-green-700' :
                    change.eventType === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {change.eventType}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-gray-800">
                  <span className="font-medium">{change.table}</span>
                  {change.new?.name && (
                    <span className="ml-2 text-gray-600">- {change.new.name}</span>
                  )}
                </div>
              </div>
            ))}
            
            {changes.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                No recent activity
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}