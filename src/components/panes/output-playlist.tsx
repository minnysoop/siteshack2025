import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from 'react'

export default function OutputPlaylist() {
    const { displayName } = useContext(AuthContext)

    return (
        <div className="bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg">
            <div className="mb-2 text-sm opacity-75">
                {displayName ? `${displayName}'s work output` : "User's work output"}
            </div>
            </div>
    )
}