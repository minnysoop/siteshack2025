'use client'

import Header from "@/components/header/header";
import LoginButton from "@/components/auth/login";
import CodeEditor from "@/components/panes/code-editor"
import SearchArea from "@/components/panes/search"
import OutputPlaylist from "@/components/panes/output-playlist"
import UserPlaylistView from "@/components/panes/user-playlist-view"
import LogoutButton from '@/components/auth/logout'

import {AuthContext} from "@/providers/auth-provider";
import { OutputProvider } from "@/providers/output-provider"

import { useContext } from 'react'

export default function Home() {
  const { access_token } = useContext(AuthContext);

  return (
    <>
        <div className="flex flex-col h-screen scrollbar-none overflow-hidden">
          <div className="w-full bg-black rounded p-3 flex justify-evenly">
            <div><Header /></div>
            
            {access_token ? <LogoutButton /> : <LoginButton />}

          </div>
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 ml-10">
            <div className="max-h-[400px]">
              <SearchArea />
            </div>
            <OutputProvider>
            <div className="border border-[#1E1E1E] rounded-lg bg-[#1E1E1E] mr-10 mt-2">
              <div className="max-h-[400px]">
                <CodeEditor />
              </div>
            </div>
            <div className="mr-2 ml-2 border rounded max-h-[250px] overflow-y-auto">
                <UserPlaylistView />
            </div>
            <div className="border rounded-lg mr-10 max-h-[250px]">
              <div>
                <OutputPlaylist />
              </div>
            </div>
            </OutputProvider>
          </div>
        </div>
    </>
  );
}
