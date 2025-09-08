import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from 'react'
import { OutputContext } from '@/providers/output-provider'

export default function OutputPlaylist() {
    const { displayName, access_token } = useContext(AuthContext)
    const { code, playlist, tracks } = useContext(OutputContext)

    return (
        <div className="bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg">
            <div className="mb-2 text-sm opacity-75">
                {access_token && displayName ? `${displayName}'s work output` : "User's work output"}
            </div>
            {code}
        </div>
    )
}