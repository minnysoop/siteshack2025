import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { AuthContext } from './auth-provider';

import { Track } from '@/types/track';
import { Playlist } from '@/types/playlist'

interface OutputType {
    playlist: Playlist | undefined,
    tracks: Track[] | [],
    code: string,
    executeCode: (code: string) => void,
    refresh: number,
    setRefresh: (value: number) => void
}

export const OutputContext = createContext<OutputType>({
    playlist: undefined,
    tracks: [],
    code: "",
    executeCode: () => { },
    refresh: 0,
    setRefresh: () => { }
})

export function OutputProvider({ children }: { children: ReactNode }) {
    const [playlist, setPlaylist] = useState<Playlist>()
    const [tracks, setTracks] = useState<Track[]>([])
    const [code, setCode] = useState<string>("")
    const [refresh, setRefresh] = useState<number>(0)
    const { access_token, userid } = useContext(AuthContext)

    const executeCode = (user_code: string) => {

        const createSpotifyPlaylist = async () => {
            if (!access_token) {
                console.error("No access token available");
                return;
            }

            try {
                const response = await fetch(
                    `https://api.spotify.com/v1/users/${userid}/playlists`,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${access_token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: "Hello World",
                            description: "Created from app",
                            public: true
                        })
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error creating playlist:", errorData);
                    return;
                }

                const data = await response.json();
                console.log("Created playlist:", data);
                setRefresh(refresh + 1)

            } catch (err) {
                console.error("Failed to create playlist:", err);
            }
        }

        createSpotifyPlaylist()
        setCode(user_code)
    }

    return (
        <OutputContext.Provider value={{ playlist, tracks, code, executeCode, refresh, setRefresh }}>
            {children}
        </OutputContext.Provider>
    );
}