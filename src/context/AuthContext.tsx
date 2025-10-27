import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
  UserCredential,
  AuthError,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string;
  signInWithGoogle: () => Promise<UserCredential | null>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential | null>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<UserCredential | null>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    default:
      return error.message || 'An error occurred during authentication. Please try again.';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const credential = await signInWithPopup(auth, googleProvider);
      return credential;
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getAuthErrorMessage(authError);
      setError(errorMessage);
      console.error('Google sign-in failed:', authError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return credential;
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getAuthErrorMessage(authError);
      setError(errorMessage);
      console.error('Email sign-in failed:', authError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError('');
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      if (credential.user) {
        await updateProfile(credential.user, {
          displayName: name,
        });
      }
      
      return credential;
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getAuthErrorMessage(authError);
      setError(errorMessage);
      console.error('Email sign-up failed:', authError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      await signOut(auth);
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = getAuthErrorMessage(authError);
      setError(errorMessage);
      console.error('Sign out failed:', authError);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOutUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
