'use client'

import { createContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { UserProfile } from '@/types/profile';

interface AuthContextType {
  access_token?: string;
  userid?: string;
  setAccessToken: (token: string | undefined) => void;
  setUserid: (userid: string | undefined) => void;
  error?: string;
}

export const AuthContext = createContext<AuthContextType>({
  access_token: undefined,
  userid: undefined,
  setAccessToken: () => {},
  setUserid: () => {},
  error: undefined
});


function AuthProvider({ children }: { children: ReactNode}) {
    const [access_token, setAccessToken] = useState<string | undefined>(undefined);
    const [userid, setUserid] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
      const storedToken = localStorage.getItem('access_token');

      const getUserProfile = async (access_token: string) => {
          try {
            const response = await axios.get<UserProfile>("https://api.spotify.com/v1/me", {
                headers: {
                Authorization: `Bearer ${access_token}`
                }})
            setUserid(response.data.id)
          } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            }
        }

      if (storedToken) {
        console.log(storedToken)
        getUserProfile(storedToken)
        setAccessToken(storedToken)
      }
    },[access_token])

    return (
        <AuthContext.Provider value={{ access_token, userid, setAccessToken, setUserid, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;