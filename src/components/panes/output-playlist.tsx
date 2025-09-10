import { AuthContext } from "@/providers/auth-provider"
import { useContext, useState, useEffect } from 'react'
import { OutputContext } from '@/providers/output-provider'

export default function OutputPlaylist() {
    const { displayName, access_token } = useContext(AuthContext)
    const { error, response } = useContext(OutputContext)
    const [ output, setOutput ] = useState<string[]>([])
    const [ outputError, setOutputError ] = useState<string>("")

    useEffect(() => {
        if (!access_token) {
            setOutput([]);
            setOutputError("");
            return;
        }

        setOutputError(error || "");

        setOutput(response || []);
    }, [response, error, access_token])

    return (
        <div className="bg-black text-green-400 font-mono p-4 rounded-lg shadow-lg">
            <div className="mb-2 text-sm opacity-75">
                {access_token && displayName ? `${displayName}'s work output` : "User's work output"}
            </div>

            {outputError ? (
                <div className="text-red-500">Error: {outputError}</div>
            ) : output.length > 0 ? (
                <div className="flex-1 overflow-y-auto">
                    <ul className="mt-2 space-y-1">
                        {output.map((s, idx) => (
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>No output so far...</div>
            )}
        </div>
    )
}