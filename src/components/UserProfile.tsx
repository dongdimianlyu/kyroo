import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings, LogOut, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserProfileProps {
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!currentUser || !userProfile) return;

    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName.trim(),
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(userProfile?.displayName || '');
    setIsEditing(false);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser || !userProfile) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full max-w-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Profile</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Profile Picture */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-glow-purple">
          {userProfile.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          ) : (
            <h3 className="text-lg font-semibold text-gray-900">{userProfile.displayName}</h3>
          )}
          <p className="text-sm text-gray-500">{userProfile.email}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-gray-600">
          <Mail className="w-5 h-5" />
          <span className="text-sm">{userProfile.email}</span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">
            Joined {userProfile.createdAt.toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">
            Last active {userProfile.lastLoginAt.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 px-4 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
