import axios from 'axios'
import { Playlist } from '@/types/playlist';

interface SpotifyURI {
    "uri": string
}

interface Output {
    res: string[],
    error: string
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

    async run(): Promise<Output> {
        const rawLines = this.code.split("\n").map(line => line.trim());

        const lines = this.code.split(";").map(line => line.trim()).filter(line => line.length > 0);

        let current_error = ""
        const executions: string[] = []
        for (let i = 0; i < rawLines.length; i++) {
            const line = rawLines[i];
            if (line.length > 0 && !line.endsWith(";")) {
                current_error = `Missing semicolon on line ${i + 1}: "${line}"`;
                return { res: executions, error: current_error };
            }
        }

        const mapping: Record<string, string> = {};
        const existingPlaylists = await this.getAllPlaylists();
        let memory: Set<string> = new Set(existingPlaylists);

        try {
            for (let i = 0; i < lines.length; i++) {
                const current_line = lines[i]
                if (current_line.startsWith("CREATE PLAYLIST")) {
                    const match = current_line.match(/CREATE PLAYLIST "(.+)" STORE "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const new_title = match[1].trim()
                    const store_name = match[2].trim();
                    const newPlaylist = await this.createPlaylist(new_title);
                    mapping[store_name] = newPlaylist.id;
                    memory.add(newPlaylist.id);
                    executions.push(`Successfully created playlist ${new_title}`)

                } else if (current_line.startsWith("ADD TRACKS")) {
                    const match = current_line.match(/ADD TRACKS (\[.+\]) TO "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const tracks = JSON.parse(match[1]);
                    const playlist_id = mapping[match[2].trim()] ?? match[2].trim();
                    if (memory.has(playlist_id)) {
                        await this.addTracksToPlaylist(playlist_id, tracks)
                        executions.push(`Successfully added tracks to playlist id: ${playlist_id}`)
                    } else { throw new Error(`Error on line ${i + 1}`) }

                } else if (current_line.startsWith("ADD TRACK")) {
                    const match = current_line.match(/ADD TRACK "(.+)" TO "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const tracks = [match[1].trim()];
                    const playlist_id = mapping[match[2].trim()] ?? match[2].trim();
                    if (memory.has(playlist_id)) {
                        await this.addTracksToPlaylist(playlist_id, tracks)
                        executions.push(`Successfully added a track to playlist id: ${playlist_id}`)
                    } else { throw new Error(`Error on line ${i + 1}`) }

                } else if (current_line.startsWith("REMOVE TRACKS")) {
                    const match = current_line.match(/REMOVE TRACKS (\[.+\]) FROM "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const tracks = JSON.parse(match[1]);
                    const playlist_id = mapping[match[2].trim()] ?? match[2].trim();
                    if (memory.has(playlist_id)) {
                        await this.removeTracksFromPlaylist(playlist_id, tracks)
                        executions.push(`Successfully removed tracks to playlist id: ${playlist_id}`)
                    } else { throw new Error(`Error on line ${i + 1}`) }



                } else if (current_line.startsWith("REMOVE TRACK")) {
                    const match = current_line.match(/REMOVE TRACK "(.+)" FROM "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const tracks = [match[1]];
                    const playlist_id = mapping[match[2].trim()] ?? match[2].trim();
                    if (memory.has(playlist_id)) {
                        await this.removeTracksFromPlaylist(playlist_id, tracks)
                        executions.push(`Successfully removed a track to playlist id: ${playlist_id}`)
                    } else { throw new Error(`Error on line ${i + 1}`) }


                } else if (current_line.startsWith("UNION")) {
                    const match = current_line.match(/UNION "(.+)" WITH "(.+)" AS "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const p1 = mapping[match[1].trim()] ?? match[1].trim();
                    const p2 = mapping[match[2].trim()] ?? match[2].trim();
                    const new_name = match[3].trim()
                    if (memory.has(p1) && memory.has(p2)) {
                        const newPlaylist = await this.playlistUnion(p1, p2, new_name)
                        memory.add(newPlaylist.id);
                        mapping[new_name] = newPlaylist.id;
                        executions.push(`Successfully unioned playlist with ids ${p1} and ${p2} to make ${new_name}`)
                    } else { throw new Error(`Error on line ${i + 1}`) }


                } else if (current_line.startsWith("INTERSECT")) {
                    const match = current_line.match(/INTERSECT "(.+)" WITH "(.+)" AS "(.+)"/);
                    if (!match) {
                        throw new Error(`Error on line ${i + 1}`)
                    }
                    const p1 = mapping[match[1].trim()] ?? match[1].trim();
                    const p2 = mapping[match[2].trim()] ?? match[2].trim();
                    const new_name = match[3].trim()
                    if (memory.has(p1) && memory.has(p2)) {
                        const newPlaylist = await this.playlistIntersection(p1, p2, new_name)
                        memory.add(newPlaylist.id);
                        mapping[new_name] = newPlaylist.id;
                        executions.push(`Successfully intersected playlist with ids ${p1} and ${p2} to make ${new_name}`)
                    } else { throw new Error(`Error on line ${i + 1}`) }

                } else {
                    throw new Error(`Error on line ${i + 1}`)
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                current_error = err.message;
            } else {
                current_error = "Unknown error occurred";
            }
        }

        return {
            res: executions,
            error: current_error
        }
    }

    async getAllPlaylists() {
        if (!this.access_token || !this.userid) {
            return [];
        }
        try {
            const response = await axios.get<{ items: Playlist[] }>(
                `https://api.spotify.com/v1/users/${this.userid}/playlists`,
                {
                    headers: {
                        Authorization: `Bearer ${this.access_token}`
                    },
                })

            const result = response.data.items.map((playlist) => playlist.id)
            return result
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.message);
            } else {
                console.log("An unexpected error occurred");
            }
            return [];
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