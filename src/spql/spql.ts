import axios from 'axios'
import { Playlist } from '@/types/playlist';
import { Track } from '@/types/track';

interface OutputPlaylist {
    playlist: Playlist | undefined,
    tracks: Track[] | []
}

export class SpQL {
    access_token: string;
    code: string;

    constructor(access_token: string, code: string) {
        this.access_token = access_token
        this.code = code;
    }

    async run(): Promise<OutputPlaylist> {
        console.log(this.code)
        return {
            playlist: undefined, 
            tracks: []
        }
    }

    createPlaylist(): void {

    }

    deletePlaylist(): void {

    }

    addTracksToPlaylist() : void {

    }

    removeTracksFromPlaylist() : void {

    }

    playlistUnion(): void {

    }

    playlistIntersection(): void {

    }
}

// const createSpotifyPlaylist = async () => {
//             if (!access_token) {
//                 console.error("No access token available");
//                 return;
//             }

//             try {
//                 const response = await fetch(
//                     `https://api.spotify.com/v1/users/${userid}/playlists`,
//                     {
//                         method: "POST",
//                         headers: {
//                             "Authorization": `Bearer ${access_token}`,
//                             "Content-Type": "application/json"
//                         },
//                         body: JSON.stringify({
//                             name: "Hello World",
//                             description: "Created from app",
//                             public: true
//                         })
//                     }
//                 );

//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     console.error("Error creating playlist:", errorData);
//                     return;
//                 }

//                 const data = await response.json();
//                 console.log("Created playlist:", data);
//                 setRefresh(refresh + 1)

//             } catch (err) {
//                 console.error("Failed to create playlist:", err);
//             }
//         }