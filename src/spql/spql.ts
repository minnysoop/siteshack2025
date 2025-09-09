import axios from 'axios'
import { Playlist } from '@/types/playlist';
import { Track } from '@/types/track';

interface OutputPlaylist {
    playlist: Playlist | undefined,
    tracks: Track[] | []
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

    async run(): Promise<OutputPlaylist> {
        console.log(this.access_token)
        const response = await this.createPlaylist("ahh")

        return {
            playlist: undefined,
            tracks: []
        }
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

    deletePlaylist(): void {

    }

    addTracksToPlaylist(): void {

    }

    removeTracksFromPlaylist(): void {

    }

    playlistUnion(): void {

    }

    playlistIntersection(): void {

    }
}