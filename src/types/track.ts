interface Image {
  url: string;
  height: number;
  width: number;
}

interface Album {
  id: string;
  name: string;
  images: Image[];
}

interface Artist {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string | null;
  is_playable: boolean;
  duration_ms: number;
  uri: string;
}