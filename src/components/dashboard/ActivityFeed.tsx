import React from 'react';
import { motion } from 'framer-motion';
import { ActivityItem } from '../../types/dashboard';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

interface ActivityItemProps {
  activity: ActivityItem;
  index: number;
}

const ActivityItemComponent: React.FC<ActivityItemProps> = ({ activity, index }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 85) return '🔥';
    if (score >= 70) return '✨';
    if (score >= 60) return '👍';
    return '💪';
  };

  const getScenarioIcon = (scenario: string) => {
    const iconMap: Record<string, string> = {
      'Job Interview': '💼',
      'Small Talk': '💬',
      'Networking Event': '🤝',
      'Presentation': '📊',
      'Team Meeting': '👥',
      'Phone Call': '📞',
      'Customer Service': '🎧',
      'Dating Conversation': '💕',
      'Family Discussion': '👨‍👩‍👧‍👦'
    };
    return iconMap[scenario] || '💭';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/70 transition-all duration-300 hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">{getScenarioIcon(activity.scenario_type)}</span>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800 text-sm">{activity.scenario_type}</h4>
              <p className="text-xs text-neutral-500">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(activity.smoothness_score)}`}>
              {activity.smoothness_score}%
            </div>
            <span className="text-lg">{getScoreEmoji(activity.smoothness_score)}</span>
          </div>
        </div>

        {/* Key Improvement */}
        <div className="mb-3">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-neutral-700 font-medium leading-relaxed">
              {activity.key_improvement}
            </p>
          </div>
        </div>

        {/* Session Details */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-200/50">
          <div className="flex items-center space-x-4 text-xs text-neutral-600">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{activity.duration}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+{activity.confidence_gained} confidence</span>
            </div>
          </div>

          {/* Animated Progress Dots */}
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.1 + i * 0.1,
                  duration: 0.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 2
                }}
              />
            ))}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 mb-2">Recent Activity</h3>
          <p className="text-sm text-neutral-600">
            Your latest practice sessions and improvements
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          View All
        </motion.button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/30 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h4 className="font-semibold text-neutral-800 mb-2">No recent activity</h4>
            <p className="text-sm text-neutral-600 mb-4">
              Start your first practice session to see your progress here!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Practicing
            </motion.button>
          </motion.div>
        ) : (
          activities.map((activity, index) => (
            <ActivityItemComponent 
              key={activity.id} 
              activity={activity} 
              index={index} 
            />
          ))
        )}
      </div>

      {/* Quick Stats */}
      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/30"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {Math.round(activities.reduce((sum, a) => sum + a.smoothness_score, 0) / activities.length)}%
              </div>
              <div className="text-xs text-neutral-600">Avg Score</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {Math.round(activities.reduce((sum, a) => sum + a.duration, 0) / activities.length)}m
              </div>
              <div className="text-xs text-neutral-600">Avg Time</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                +{activities.reduce((sum, a) => sum + a.confidence_gained, 0)}
              </div>
              <div className="text-xs text-neutral-600">Total Gain</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityFeed; 