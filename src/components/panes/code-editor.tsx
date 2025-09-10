'use client'

import { useState, useContext, useRef } from "react"
import Editor from "@monaco-editor/react"
import { Play, Upload, Download  } from "lucide-react"
import { OutputContext } from "@/providers/output-provider"

export default function CodeEditor() {
    const [tmpCode, setTmpCode] = useState("")
    const { executeCode } = useContext(OutputContext)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const execute = async () => {
        setLoading(true)
        try {
            await executeCode(tmpCode)
        } finally {
            setLoading(false)
        }
    }

    const exportCode = () => {
        const blob = new Blob([tmpCode], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "script.spql"
        a.click()
        URL.revokeObjectURL(url)
    }

    const importCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (evt) => {
            const text = evt.target?.result
            if (typeof text === "string") setTmpCode(text)
        }
        reader.readAsText(file)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <>
            <div className="flex gap-2 mb-1">
                <button onClick={execute} 
                disabled={loading}
                    className={`flex items-center gap-1 px-2 py-1 rounded
                        ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                >
                    <Play size={16} /> {loading ? "Running..." : "Execute"}
                </button>
                 <button
                    onClick={exportCode}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <Download size={16} /> Export
                </button>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    <Upload size={16} /> Load
                </button>

                <input
                    type="file"
                    accept=".spql"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={importCode}
                />
            </div>
            <div className="flex flex-col h-full">
                <Editor
                    height="355px"
                    theme="vs-dark"
                    value={tmpCode}
                    onChange={(value) => setTmpCode(value || "")}
                    options={{
                        wordWrap: "on",
                        minimap: { enabled: false },
                    }}
                />
            </div>
        </>
    )
}