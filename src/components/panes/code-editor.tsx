'use client'

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Play } from "lucide-react"

export default function CodeEditor() {
    const [code, setCode] = useState("// Write your code here\n")

    const execute = () => {
        console.log("hello")
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
                    value={code}
                    onChange={(value) => setCode(value || "")}
                />
            </div>
        </>
    )
}