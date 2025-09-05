'use client'

import Execution from "@/components/header/execution";
import { useState } from "react"
import Editor from "@monaco-editor/react"

export default function CodeEditor() {
    const [code, setCode] = useState("// Write your code here\n")

    return (
        <div className="flex flex-col h-full">
            <Editor
                height="400px"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
            />
        </div>
    )
}