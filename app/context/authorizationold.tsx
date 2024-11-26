"use client";

import { useState, useEffect, createContext, ReactNode } from 'react';
import axiosInstance from '../services/axiosInstance';

// Define the shape of your context
export interface AuthContextTypeOld {
  verifyToken: () => Promise<void>;
  userEnrolled: boolean;
  setUserEnrolled: React.Dispatch<React.SetStateAction<boolean>>;
  userCheckedIn: boolean;
  setuserCheckedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  userGetNotifications: boolean;
  setUserGetNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  userIsActive: boolean;
  error: string | null;
}

// Create the context with default values
const AuthContextOld = createContext<AuthContextTypeOld | undefined>(undefined);

interface AuthWrapperProps {
  children: ReactNode; // To allow passing child components
}

function AuthWrapperOld({ children }: AuthWrapperProps) {
  const [error, setError] = useState<string | null>(null);
  const [userCheckedIn, setuserCheckedIn] = useState<boolean>(false);
  const [userEnrolled, setUserEnrolled] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userGetNotifications, setUserGetNotifications] = useState<boolean>(false);
  const [userIsActive, setUserIsActive] = useState<boolean>(false);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      let authToken = localStorage.getItem('authToken');

      // console.log("authToken", authToken);
      if (!authToken || authToken === 'undefined' || authToken === null || authToken === '') {
        const newTokenResponse = await axiosInstance.get<{ authToken: string; errorMessage?: string }>('/api/auth/gettoken');
        // console.log('newTokenResponse', newTokenResponse);
        if (newTokenResponse.data.errorMessage) {
          throw new Error(newTokenResponse.data.errorMessage);
        }

        authToken = newTokenResponse.data.authToken;
        localStorage.setItem('authToken', authToken);
      }

      const userInfo = await axiosInstance.get<{
        enrolled: boolean;
        email: string;
        getNotifications: boolean;
        isActive: boolean;
        errorMessage?: string;
      }>('/api/auth/verify');

      if (userInfo.data.errorMessage) {
        throw new Error(userInfo.data.errorMessage);
      }

      if (userInfo.data.enrolled) {
        const { email, getNotifications, isActive } = userInfo.data;
        setUserEnrolled(true);
        setUserEmail(email);
        setUserGetNotifications(getNotifications);
        setUserIsActive(isActive);
      }

      setuserCheckedIn(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error verifying token or loading new token: ', error.message);
      localStorage.setItem('authToken', '');
      // window.location.reload();
      setError(error.message);
    }
  };

  const passedContext: AuthContextTypeOld = {
    verifyToken,
    userEnrolled,
    setUserEnrolled,
    userCheckedIn,
    setuserCheckedIn,
    userEmail,
    setUserEmail,
    userGetNotifications,
    setUserGetNotifications,
    userIsActive,
    error,
  };

  return <AuthContextOld.Provider value={passedContext}>{children}</AuthContextOld.Provider>;
}

export { AuthContextOld, AuthWrapperOld };