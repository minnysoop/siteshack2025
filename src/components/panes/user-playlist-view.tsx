import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from "react"
import { Playlist } from "@/types/playlist";
import axios from 'axios';

export default function UserPlaylistView() {
    const { access_token, userid } = useContext(AuthContext)
    const [data, setData] = useState<Playlist[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        const fetchUserPlaylists = async () => {
          if (!access_token) return
          try {
            const response = await axios.get<{ items: Playlist[] }>(
            `https://api.spotify.com/v1/users/${userid}/playlists`,
            {
                headers: {
                Authorization: `Bearer ${access_token}`
                },
            })
            setData(response.data.items);
          } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
          }};


        fetchUserPlaylists();
      }, [access_token, userid]);
    
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            {access_token && data ? (
                <ul>
                {data.map((playlist) => (
                    <li key={playlist.id}>{playlist.name}</li>
                ))}
                </ul>
            ) : (
                <div>No Playlists</div>
            )}
        </>
    )
}