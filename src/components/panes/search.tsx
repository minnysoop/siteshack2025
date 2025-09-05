'use client'

import { Search as SearchIcon } from "lucide-react"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/providers/auth-provider"

import axios from 'axios'
import { Track, Tracks } from "@/types/track"

export default function Search() {
    const [query, setQuery] = useState("")
    const [tracks, setTracks] = useState<Track[]>([])
    const [error, setError] = useState("")
    const { access_token } = useContext(AuthContext)

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
    }

    return (
        <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />

            {error && <p className="text-red-500 mb-2">{error}</p>}

            {tracks.length > 0 && (
                <ul className="space-y-2">
                    {tracks.map(track => (
                        <li key={track.id} onClick={async () => {await copyTrackId(track.id)}} className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-100">
                            {track.album.images[0] && (
                                <img src={track.album.images[0].url} alt={track.name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div>
                                <p className="font-medium">{track.name}</p>
                                <p className="text-sm text-gray-500">
                                    {track.artists.map(a => a.name).join(", ")} — {track.album.name}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>)}
        </div>
    )
}