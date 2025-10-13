import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseEnabled } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
  userProfile: UserProfile | null;
}

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    if (!isFirebaseEnabled || !auth || !db) {
      const mockUser = {
        uid: 'mock-' + Math.random().toString(36).slice(2),
        email,
        displayName,
        photoURL: null,
      } as unknown as User;

      const profile: UserProfile = {
        uid: (mockUser as unknown as { uid: string }).uid,
        displayName,
        email,
        photoURL: undefined,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: { notifications: true, theme: 'light' },
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('mockAuthUser', JSON.stringify({ email, displayName, uid: profile.uid }));
        localStorage.setItem('mockUserProfile', JSON.stringify(profile));
      }

      setCurrentUser(mockUser);
      setUserProfile(profile);

      const credential = { user: mockUser } as unknown as UserCredential;
      return Promise.resolve(credential);
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });

    const profile: UserProfile = {
      uid: result.user.uid,
      displayName,
      email: result.user.email!,
      photoURL: result.user.photoURL || undefined,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      preferences: { notifications: true, theme: 'light' },
    };

    await setDoc(doc(db, 'users', result.user.uid), profile);
    setUserProfile(profile);

    return result;
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    if (!isFirebaseEnabled || !auth || !db) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('mockUserProfile') : null;
      const profile: UserProfile | null = stored ? JSON.parse(stored) : null;
      const displayName = profile?.displayName || email.split('@')[0];
      const mockUser = {
        uid: profile?.uid || 'mock-' + Math.random().toString(36).slice(2),
        email,
        displayName,
        photoURL: null,
      } as unknown as User;

      const updatedProfile: UserProfile = profile
        ? { ...profile, lastLoginAt: new Date() }
        : {
            uid: (mockUser as unknown as { uid: string }).uid,
            displayName,
            email,
            photoURL: undefined,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            preferences: { notifications: true, theme: 'light' },
          };

      if (typeof window !== 'undefined') {
        localStorage.setItem('mockAuthUser', JSON.stringify({ email, displayName, uid: updatedProfile.uid }));
        localStorage.setItem('mockUserProfile', JSON.stringify(updatedProfile));
      }

      setCurrentUser(mockUser);
      setUserProfile(updatedProfile);
      const credential = { user: mockUser } as unknown as UserCredential;
      return Promise.resolve(credential);
    }

    const result = await signInWithEmailAndPassword(auth, email, password);
    if (userProfile && db) {
      const updatedProfile = { ...userProfile, lastLoginAt: new Date() };
      await setDoc(doc(db, 'users', result.user.uid), updatedProfile);
      setUserProfile(updatedProfile);
    }
    return result;
  };

  const loginWithGoogle = async (): Promise<UserCredential> => {
    if (!isFirebaseEnabled || !auth || !db) {
      const email = 'mock.user@example.com';
      const displayName = 'Mock User';
      const mockUser = {
        uid: 'mock-google-' + Math.random().toString(36).slice(2),
        email,
        displayName,
        photoURL: null,
      } as unknown as User;

      const profile: UserProfile = {
        uid: (mockUser as unknown as { uid: string }).uid,
        displayName,
        email,
        photoURL: undefined,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: { notifications: true, theme: 'light' },
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('mockAuthUser', JSON.stringify({ email, displayName, uid: profile.uid }));
        localStorage.setItem('mockUserProfile', JSON.stringify(profile));
      }

      setCurrentUser(mockUser);
      setUserProfile(profile);
      const credential = { user: mockUser } as unknown as UserCredential;
      return Promise.resolve(credential);
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      const profile: UserProfile = {
        uid: result.user.uid,
        displayName: result.user.displayName || 'User',
        email: result.user.email!,
        photoURL: result.user.photoURL || undefined,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        preferences: { notifications: true, theme: 'light' },
      };
      await setDoc(doc(db, 'users', result.user.uid), profile);
      setUserProfile(profile);
    } else {
      const existingProfile = userDoc.data() as UserProfile;
      const updatedProfile = { ...existingProfile, lastLoginAt: new Date() };
      await setDoc(doc(db, 'users', result.user.uid), updatedProfile);
      setUserProfile(updatedProfile);
    }
    return result;
  };

  const logout = async (): Promise<void> => {
    if (!isFirebaseEnabled || !auth) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockAuthUser');
        localStorage.removeItem('mockUserProfile');
      }
      setCurrentUser(null);
      setUserProfile(null);
      return Promise.resolve();
    }
    await signOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!isFirebaseEnabled || !auth) {
      // In mock mode, pretend it succeeded
      return Promise.resolve();
    }
    await sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    if (!isFirebaseEnabled || !auth || !db) {
      // Restore mock session if present
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('mockAuthUser');
        const storedProfile = localStorage.getItem('mockUserProfile');
        if (storedUser) {
          const uParsed = JSON.parse(storedUser);
          const mockUser = {
            uid: uParsed.uid,
            email: uParsed.email,
            displayName: uParsed.displayName,
            photoURL: null,
          } as unknown as User;
          setCurrentUser(mockUser);
        }
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    loading,
    userProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
