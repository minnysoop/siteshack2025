import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { AuthContext } from './auth-provider';
import axios from 'axios';

import { Playlist } from '@/types/playlist'
import { OutputType } from '@/types/outputPlaylist';
import { SpQL } from '@/spql/spql'

export const OutputContext = createContext<OutputType>({
    playlist: undefined,
    code: "",
    error: "",
    executeCode: () => { },
    refresh: 0,
    setRefresh: () => { }
})

export function OutputProvider({ children }: { children: ReactNode }) {
    const [playlist, setPlaylist] = useState<Playlist>()
    const [code, setCode] = useState<string>("")
    const [error, setError] = useState<string>("")
    const [refresh, setRefresh] = useState<number>(0)
    const { access_token, userid } = useContext(AuthContext)

    const executeCode = async (user_code: string) => {
        try {
            const code_runner = new SpQL((access_token ? access_token : ""), user_code)
            await code_runner.run()
            setRefresh(refresh + 1)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    }

    return (
        <OutputContext.Provider value={{ playlist, code, error, executeCode, refresh, setRefresh }}>
            {children}
        </OutputContext.Provider>
    );
}