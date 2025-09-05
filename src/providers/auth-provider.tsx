'use client'

import { createContext, ReactNode, useState, useEffect } from 'react';

interface AuthContextType {
  access_token?: string;
  setAccessToken: (token: string | undefined) => void;
}

export const AuthContext = createContext<AuthContextType>({
  access_token: undefined,
  setAccessToken: () => {},
});


function AuthProvider({ children }: { children: ReactNode}) {
    const [access_token, setAccessToken] = useState<string | undefined>(undefined);

    useEffect(() => {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        setAccessToken(access_token)
      }
    },[])

    return (
        <AuthContext.Provider value={{ access_token, setAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;