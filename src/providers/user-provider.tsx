'use client'

import { createContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { UserProfile } from '@/types/profile';

interface UserContextType {
  userid?: string;
  error?: string;
}

export const UserContext = createContext<UserContextType>({
  userid: undefined,
  error: ""
});

function UserProvider({ children }: { children: ReactNode}) {
    const [userid, setUserid] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUserInfo = async (access_token: string) => {
            try {
                const response = await axios.get<UserProfile>("https://api.spotify.com/v1/me", {
                headers: {
                Authorization: `Bearer ${access_token}`
                }})

                setUserid(response.data.id)
                console.log(response.data.id)
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            } 
        }

        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            fetchUserInfo(access_token)
        } 
    },[])

    return (
        <UserContext.Provider value={{ userid, error }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;