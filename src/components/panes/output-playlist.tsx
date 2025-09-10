import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from 'react'
import { OutputContext } from '@/providers/output-provider'
import axios from "axios"
import { Track } from "@/types/track"

export default function OutputPlaylist() {
    const { displayName, access_token } = useContext(AuthContext)
    const { error, playlist } = useContext(OutputContext)
    const [fetchError, setFetchError] = useState("")
    const [tracks, setTracks] = useState<Track[]>([])

    useEffect(() => {
        if (!playlist || !access_token) {
            setTracks([]);
            return;
        }

        const fetchPlaylistTracks = async () => {
            if (!access_token) return;
            try {
                const response = await axios.get<{ items: { track: Track }[] }>(
                    `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
                    { headers: { Authorization: `Bearer ${access_token}` } }
                );
                const playlistTracks = response.data.items.map(item => item.track);
                setTracks(playlistTracks);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) setFetchError(err.message);
                else setFetchError("An unexpected error occurred");
            }
        };

        fetchPlaylistTracks()

    }, [playlist, access_token])

    return (
        <div className="bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg">
            <div className="mb-2 text-sm opacity-75">
                {access_token && displayName ? `${displayName}'s work output` : "User's work output"}
            </div>

            {error || fetchError ? (
                <div>Error: {error || fetchError}</div>
            ) : playlist ? (
                <div className="flex-1 overflow-y-auto">
                    <div>Successfully Created Playlist: {playlist.name}</div>
                    <ul className="mt-2 space-y-1">
                        {tracks.map(track => (
                            <li key={track.id}>
                                {track.name} — {track.artists.map(a => a.name).join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>No playlist to show</div>
            )}
        </div>
    )
}