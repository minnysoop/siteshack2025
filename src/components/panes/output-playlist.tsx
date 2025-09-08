import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from 'react'
import { OutputContext } from '@/providers/output-provider'

export default function OutputPlaylist() {
    const { displayName, access_token } = useContext(AuthContext)
    const { error, playlist } = useContext(OutputContext)

    return (
        <div className="bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg">
            <div className="mb-2 text-sm opacity-75">
                {access_token && displayName ? `${displayName}'s work output` : "User's work output"}
            </div>

            {error ? <div>Error `${error}`</div> : 
                <div>
                    {playlist ? <div>`${playlist.id}`</div> : <div>No playlist to show</div>}
                </div>}
        </div>
    )
}