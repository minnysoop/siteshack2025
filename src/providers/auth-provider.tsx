'use client'

import { createContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { UserProfile } from '@/types/profile';

interface AuthContextType {
  access_token?: string;
  userid?: string;
  displayName?: string;
  setAccessToken: (token: string | undefined) => void;
  setUserid: (userid: string | undefined) => void;
  error?: string;
}

export const AuthContext = createContext<AuthContextType>({
  access_token: undefined,
  userid: undefined,
  displayName: undefined,
  setAccessToken: () => {},
  setUserid: () => {},
  error: undefined
});


function AuthProvider({ children }: { children: ReactNode}) {
    const [access_token, setAccessToken] = useState<string | undefined>(undefined);
    const [userid, setUserid] = useState<string | undefined>(undefined);
    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        console.log("Loaded token from localStorage:", storedToken);
        setAccessToken(storedToken);
      }
    }, []);

    useEffect(() => {
      if (!access_token) return;
      
      const getUserProfile = async () => {
          try {
            const response = await axios.get<UserProfile>("https://api.spotify.com/v1/me", {
                headers: {
                Authorization: `Bearer ${access_token}`
                }})
            setUserid(response.data.id)
            setDisplayName(response.data.display_name)
            console.log(displayName)
            setError(undefined);
          } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            }
        }
      
      getUserProfile()
    },[access_token])

    return (
        <AuthContext.Provider value={{ access_token, userid, displayName, setAccessToken, setUserid, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;