'use client'

import { useState, useContext } from "react"
import Editor from "@monaco-editor/react"
import { Play } from "lucide-react"
import { OutputContext } from "@/providers/output-provider"

export default function CodeEditor() {
    const [tmpCode, setTmpCode] = useState("")
    const { executeCode} = useContext(OutputContext)

    const execute = () => {
        executeCode(tmpCode)
    }

    return (
        <>
            <div className="flex justify-start mb-1">
                <button onClick={execute} className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    <Play size={16} /> Execute
                </button>
            </div>
            <div className="flex flex-col h-full">
                <Editor
                    height="355px"
                    theme="vs-dark"
                    value={tmpCode}
                    onChange={(value) => setTmpCode(value || "")}
                />
            </div>
        </>
    )
}