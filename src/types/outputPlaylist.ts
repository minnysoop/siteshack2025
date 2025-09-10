import { Playlist } from "./playlist"
import { Track } from "./track"

export interface OutputType {
    playlist: Playlist | undefined,
    code: string,
    error: string,
    executeCode: (code: string) => void,
    refresh: number,
    setRefresh: (value: number) => void,
    response: string[]
}