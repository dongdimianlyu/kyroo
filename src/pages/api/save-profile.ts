import { NextApiRequest, NextApiResponse } from 'next';

interface UserProfile {
  // Basic info
  name: string;
  age: number;
  pronouns: string;
  
  // Goals and motivations
  primaryGoal: 'build_confidence' | 'improve_relationships' | 'work_communication' | 'social_anxiety' | 'dating' | 'other';
  specificGoals: string[];
  motivations: string[];
  
  // Current situation
  socialComfortLevel: number; // 1-10
  challengingScenarios: string[];
  successfulScenarios: string[];
  
  // Communication style
  communicationStyle: 'direct' | 'diplomatic' | 'analytical' | 'supportive' | 'mixed';
  preferredFeedbackStyle: 'gentle' | 'direct' | 'detailed' | 'encouraging';
  
  // Interests and context
  interests: string[];
  lifestyle: 'student' | 'working_professional' | 'freelancer' | 'retired' | 'between_jobs' | 'other';
  relationshipStatus: 'single' | 'dating' | 'relationship' | 'married' | 'prefer_not_to_say';
  
  // Practice preferences
  sessionFrequency: 'daily' | 'few_times_week' | 'weekly' | 'as_needed';
  sessionLength: 'short' | 'medium' | 'long'; // 5-10min, 10-20min, 20+ min
  practiceAreas: string[];
  
  // Accessibility and comfort
  voicePracticeComfort: number; // 1-10
  feedbackSensitivity: number; // 1-10
  triggerTopics: string[];
  
  // Optional context
  aboutYourself: string;
  previousExperience: string;
}

interface SaveProfileRequest {
  anonId: string;
  profile: Partial<UserProfile>;
  timestamp: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { anonId, profile, timestamp }: SaveProfileRequest = req.body;

    if (!anonId) {
      return res.status(400).json({ error: 'Anonymous ID is required' });
    }

    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    // Validate required fields
    const requiredFields = ['name', 'age', 'pronouns', 'primaryGoal'];
    const missingFields = requiredFields.filter(field => !profile[field as keyof UserProfile]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // In a real application, you would save this to a database
    // For now, we'll just log it and return success
    console.log('Saving user profile:', {
      anonId,
      profile: {
        ...profile,
        // Don't log sensitive information in production
        name: profile.name ? '[REDACTED]' : undefined,
        aboutYourself: profile.aboutYourself ? '[REDACTED]' : undefined,
        previousExperience: profile.previousExperience ? '[REDACTED]' : undefined,
      },
      timestamp
    });

    // Here you would typically:
    // 1. Save to your database
    // 2. Update user preferences
    // 3. Initialize personalization settings
    // 4. Set up user-specific recommendations

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return res.status(200).json({ 
      success: true,
      message: 'Profile saved successfully',
      profileId: `profile_${anonId}_${Date.now()}`
    });

  } catch (error) {
    console.error('Error saving profile:', error);
    return res.status(500).json({ 
      error: 'Failed to save profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function to get user profile (for use in other API endpoints)
export function getUserProfile(anonId: string): Partial<UserProfile> | null {
  // In a real application, this would fetch from your database
  // For now, we'll return null since we're not actually storing data
  return null;
}

// Helper function to validate profile completeness
export function validateProfile(profile: Partial<UserProfile>): { isValid: boolean; missingFields: string[] } {
  const requiredFields: (keyof UserProfile)[] = [
    'name',
    'age', 
    'pronouns',
    'primaryGoal',
    'communicationStyle',
    'preferredFeedbackStyle'
  ];

  const missingFields = requiredFields.filter(field => {
    const value = profile[field];
    return value === undefined || value === null || value === '';
  });

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

// Helper function to generate personalized context for AI
export function generatePersonalizedContext(profile: Partial<UserProfile>): string {
  const context = [];

  if (profile.name) {
    context.push(`User's name: ${profile.name}`);
  }

  if (profile.age) {
    context.push(`Age: ${profile.age}`);
  }

  if (profile.pronouns) {
    context.push(`Pronouns: ${profile.pronouns}`);
  }

  if (profile.primaryGoal) {
    context.push(`Primary goal: ${profile.primaryGoal.replace('_', ' ')}`);
  }

  if (profile.specificGoals && profile.specificGoals.length > 0) {
    context.push(`Specific goals: ${profile.specificGoals.join(', ')}`);
  }

  if (profile.socialComfortLevel) {
    context.push(`Social comfort level: ${profile.socialComfortLevel}/10`);
  }

  if (profile.communicationStyle) {
    context.push(`Communication style: ${profile.communicationStyle}`);
  }

  if (profile.preferredFeedbackStyle) {
    context.push(`Preferred feedback style: ${profile.preferredFeedbackStyle}`);
  }

  if (profile.challengingScenarios && profile.challengingScenarios.length > 0) {
    context.push(`Challenging scenarios: ${profile.challengingScenarios.join(', ')}`);
  }

  if (profile.successfulScenarios && profile.successfulScenarios.length > 0) {
    context.push(`Comfortable scenarios: ${profile.successfulScenarios.join(', ')}`);
  }

  if (profile.interests && profile.interests.length > 0) {
    context.push(`Interests: ${profile.interests.join(', ')}`);
  }

  if (profile.lifestyle) {
    context.push(`Lifestyle: ${profile.lifestyle.replace('_', ' ')}`);
  }

  if (profile.sessionLength) {
    context.push(`Preferred session length: ${profile.sessionLength}`);
  }

  if (profile.feedbackSensitivity) {
    context.push(`Feedback sensitivity: ${profile.feedbackSensitivity}/10`);
  }

  if (profile.triggerTopics && profile.triggerTopics.length > 0) {
    context.push(`Topics to avoid: ${profile.triggerTopics.join(', ')}`);
  }

  if (profile.aboutYourself) {
    context.push(`About themselves: ${profile.aboutYourself}`);
  }

  if (profile.previousExperience) {
    context.push(`Previous experience: ${profile.previousExperience}`);
  }

  return context.join('\n');
} 