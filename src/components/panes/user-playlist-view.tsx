import { AuthContext } from "@/providers/auth-provider"
import { OutputContext } from "@/providers/output-provider";
import { useContext, useState, useEffect } from "react"
import { Playlist } from "@/types/playlist";
import { Track } from "@/types/track";
import axios from 'axios';

export default function UserPlaylistView() {
    const { access_token, userid } = useContext(AuthContext)
    const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [tracks, setTracks] = useState<Track[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const { refresh } = useContext(OutputContext)

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // hide after 3 seconds
    };

    useEffect(() => {

        const fetchUserPlaylists = async () => {
            if (!access_token || !userid) {
                setPlaylists([])
                return;
            }
            try {
                const response = await axios.get<{ items: Playlist[] }>(
                    `https://api.spotify.com/v1/users/${userid}/playlists`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`
                        },
                    })
                setPlaylists(response.data.items);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            }
        };


        fetchUserPlaylists();
    }, [refresh, access_token, userid]);

    const fetchPlaylistTracks = async (playlistId: string) => {
        if (!access_token) return;
        try {
            const response = await axios.get<{ items: { track: Track }[] }>(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                { headers: { Authorization: `Bearer ${access_token}` } }
            );
            const playlistTracks = response.data.items.map(item => item.track);
            setTracks(playlistTracks);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) setError(err.message);
            else setError("An unexpected error occurred");
        }
    };

    const handlePlaylistClick = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
        fetchPlaylistTracks(playlist.id);
    };

    const handleBack = () => {
        setSelectedPlaylist(null);
        setTracks(null);
    };

    const copyPlaylistID = async () => {
        if (!selectedPlaylist) return;
        await navigator.clipboard.writeText(selectedPlaylist.id);
        showToast(`Playlist ID copied!`);
    };

    const copyTrackId = async (id: string) => {
        await navigator.clipboard.writeText(id);
        showToast(`Track ID copied!`);
    }

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex-1 overflow-y-auto space-y-2 text-white">
            {toastMessage && (
                <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
                    {toastMessage}
                </div>
            )}
            {!selectedPlaylist ? (
                <ul className="text-white shadow-lg space-y-3">
                    {playlists?.map((playlist) => (
                        <li
                            key={playlist.id}
                            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 hover:text-black hover:opacity-80 cursor-pointer w-full"
                            onClick={() => handlePlaylistClick(playlist)}
                        >
                            {playlist.name}
                        </li>
                    ))}
                    {!playlists && (
                        <div className="text-center text-gray-400 font-medium mt-6">
                            No Playlists
                        </div>
                    )}
                </ul>
            ) : (
                <div>
                    <button
                        className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                        onClick={handleBack}
                    >
                        ← Back to All Playlists
                    </button>
                    <button
                        className="mb-4 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                        onClick={copyPlaylistID}
                    >
                        Copy ID to clipboard
                    </button>
                    <h2 className="text-xl font-bold mb-2">Title: {selectedPlaylist.name}</h2>
                    {tracks ? (
                        <ul className="space-y-2">
                            {tracks.map(track => (
                                <li key={track.id}
                                    onClick={async () => { await copyTrackId(track.id) }}
                                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 hover:text-black hover:opacity-80 cursor-pointer"
                                >
                                    {track.album.images[0] && (
                                        <img src={track.album.images[0].url} alt={track.name} className="w-12 object-cover rounded" />
                                    )}
                                    <div>
                                        <p className="font-medium">{track.name}</p>
                                        <p className="text-sm">
                                            {track.artists.map(a => a.name).join(", ")} — {track.album.name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-gray-400">Loading tracks...</div>
                    )}
                </div>
            )}
        </div>
    )
}