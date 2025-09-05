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
          <div className="flex-1 grid grid-cols-2 grid-rows-2">
            <div className="border">
              <OutputPlaylist />
            </div>
            <div className="border">
              <CodeEditor />
            </div>
            <div className="border">
              <UserPlaylistView />
            </div>
            <div className="border">
              <SearchArea />
            </div>
          </div>
        </div>
    </>
  );
}
