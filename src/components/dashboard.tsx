import CodeEditor from "@/components/panes/code-editor"
import Console from "@/components/panes/console"
import OutputPlaylist from "@/components/panes/output-playlist"
import UserPlaylistView from "@/components/panes/user-playlist-view"

export default function Dashboard() {
  return (
    <>
      <CodeEditor/>
      <Console/>
      <OutputPlaylist/>
      <UserPlaylistView/>
    </>
  );
}
