import axios from 'axios'
import { Playlist } from '@/types/playlist';

interface SpotifyURI {
    "uri": string
}

function toSpotifyURIArray(uris: string[]): SpotifyURI[] {
    return uris.map(uri => ({ uri }));
}

export class SpQL {
    access_token: string;
    userid: string;
    code: string;

    constructor(access_token: string, code: string, userid: string) {
        this.access_token = access_token
        this.code = code;
        this.userid = userid
    }

    async run(): Promise<Playlist> {
        console.log(this.access_token)
        
        const newPlaylist = await this.createPlaylist("oof")
        const response = await this.addTracksToPlaylist(newPlaylist.id, [
            'spotify:track:1CPZ5BxNNd0n0nF4Orb9JS',
            'spotify:track:1j15Ar0qGDzIR0v3CQv3JL',
            'spotify:track:0WbMK4wrZ1wFSty9F7FCgu',
            'spotify:track:0d28khcov6AiegSCpG5TuT',
            'spotify:track:08bNPGLD8AhKpnnERrAc6G'
        ])

        return newPlaylist
    }

    async createPlaylist(title: string) {
        if (!this.access_token) {
            throw new Error("No access token available")
        }

        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/users/${this.userid}/playlists`,
                {
                    name: title,
                    description: "",
                    public: true
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.access_token}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            return response.data
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.message)
            } else {
                throw new Error("An unexpected error occurred")
            }
        }
    }

    async removeTracksFromPlaylist(playlist_id: string, tracks: string[]) {
        if (!this.access_token) {
            throw new Error("No access token available");
        }

        const t = toSpotifyURIArray(tracks)

        try {
            const response = await axios.delete(
                `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                {
                    headers: {
                        "Authorization": `Bearer ${this.access_token}`,
                        "Content-Type": "application/json"
                    },
                    data: {
                        "tracks": t
                    }
                }
            );
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.message);
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }

    async addTracksToPlaylist(playlist_id: string, uris: string[]) {
        if (!this.access_token) {
            throw new Error("No access token available");
        }

        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                {
                    uris: uris,
                    position: 0
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.access_token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.message);
            } else {
                throw new Error("An unexpected error occurred");
            }
        }

    }

    async getAllTracksFromPlaylist(playlist_id: string) {
        if (!this.access_token) {
            throw new Error("No access token available");
        }

        let allURIs: any[] = [];
        let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=100`;

        try {
            while (url) {
                const response = await axios.get(url, {
                    headers: {
                        "Authorization": `Bearer ${this.access_token}`,
                        "Content-Type": "application/json"
                    }
                });
                allURIs.push(...response.data.items);
                url = response.data.next;
            }
            return allURIs;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.message);
            } else {
                throw new Error("An unexpected error occurred");
            }
        }

    }

    async playlistUnion(title: string, p1: string, p2: string) {
        const newPlaylist = await this.createPlaylist(title)
        const tracks1 = await this.getAllTracksFromPlaylist(p1);
        const tracks2 = await this.getAllTracksFromPlaylist(p2);

        const trackURIs = Array.from(new Set([
            ...tracks1.map((t: any) => t.track.uri),
            ...tracks2.map((t: any) => t.track.uri)
        ]));

        for (let i = 0; i < trackURIs.length; i += 100) {
            const batch = trackURIs.slice(i, i + 100);
            await this.addTracksToPlaylist(newPlaylist.id, batch)
        }
        return newPlaylist
    }

    async playlistIntersection(title: string, p1: string, p2: string) {
        const newPlaylist = await this.createPlaylist(title)
        const tracks1 = await this.getAllTracksFromPlaylist(p1);
        const tracks2 = await this.getAllTracksFromPlaylist(p2);

        const uris1 = tracks1.map((item: any) => item.track.uri)
        const uris2 = tracks2.map((item: any) => item.track.uri)

        const intersectionURIs = uris1.filter(uri => uris2.includes(uri));
        if (intersectionURIs.length === 0) return newPlaylist;

        for (let i = 0; i < intersectionURIs.length; i += 100) {
            const batch = intersectionURIs.slice(i, i + 100);
            await this.addTracksToPlaylist(newPlaylist.id, batch)
        }
        return newPlaylist
    }
}