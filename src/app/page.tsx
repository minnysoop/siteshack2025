'use client'

import Header from "@/components/header/header";
import LoginButton from "@/components/auth/login";
import CodeEditor from "@/components/panes/code-editor"
import SearchArea from "@/components/panes/search"
import OutputPlaylist from "@/components/panes/output-playlist"
import UserPlaylistView from "@/components/panes/user-playlist-view"
import LogoutButton from '@/components/auth/logout'

import {AuthContext} from "@/providers/auth-provider";

import { useContext } from 'react'

export default function Home() {
  const { access_token } = useContext(AuthContext);

  return (
    <>
        <div className="flex flex-col h-screen">
          <div className="w-full bg-black rounded p-3 flex justify-evenly">
            <div><Header /></div>
            
            {access_token ? <LogoutButton /> : <LoginButton />}

          </div>
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
            <div>
              <SearchArea />
            </div>
            <div className="border border-[#1E1E1E] rounded-lg bg-[#1E1E1E]">
              <CodeEditor />
            </div>
            <div className="border rounded-lg">
              <UserPlaylistView />
            </div>
            <div className="border rounded-lg">
              <OutputPlaylist />
            </div>
          </div>
        </div>
    </>
  );
}
