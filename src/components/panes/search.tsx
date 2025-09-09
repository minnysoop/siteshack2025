'use client'

import { Search as SearchIcon } from "lucide-react"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/providers/auth-provider"

import axios from 'axios'
import { Track } from "@/types/track"

export default function Search() {
    const [query, setQuery] = useState("")
    const [tracks, setTracks] = useState<Track[]>([])
    const [error, setError] = useState("")
    const { access_token } = useContext(AuthContext)
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // hide after 3 seconds
    };

    useEffect(() => {
        const retrieveSearchedTracks = async () => {
            if (!query) {
                setTracks([])
                return
            }

            try {
                const response = await axios.get(`https://api.spotify.com/v1/search`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                    params: {
                        q: query,
                        type: 'track',
                        limit: 10
                    }
                })
                setTracks(response.data.tracks.items)
                setError("")
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.message);
                } else {
                    setError("An unexpected error occurred");
                }
            }
        }

        retrieveSearchedTracks()
    }, [query])

    const copyTrackId = async (id: string) => {
        await navigator.clipboard.writeText(id);
        showToast(`Track ID copied!`);
    }

    return (
        <div className="flex flex-col h-full">
            {toastMessage && (
                <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
                    {toastMessage}
                </div>
            )}
            
            <div className="relative sticky p-2">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 border border-gray-300 rounded p-2"
                />
                {error && <p className="text-red-500 mt-1">{error}</p>}
            </div>

            <div className="flex-1  overflow-y-auto space-y-2 text-white mr-2 ml-2 border rounded">
                {query && tracks.map(track => (
                    <li key={track.id} 
                        onClick={async () => { await copyTrackId(track.uri) }}
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
            </div>
        </div>
    )
}