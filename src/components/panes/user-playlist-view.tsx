import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from "react"
import { Playlist } from "@/types/playlist";
import axios from 'axios';
import { UserContext } from "@/providers/user-provider";

export default function UserPlaylistView() {
    const { access_token } = useContext(AuthContext)
    const { userid } = useContext(UserContext)
    const [data, setData] = useState<Playlist[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPlaylists = async () => {
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
          } finally {
            setLoading(false);
          }
        };

        if (access_token && userid) {
            fetchUserPlaylists();
        } else {
            setLoading(false);
        }
      }, [access_token, userid]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error</div>;

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