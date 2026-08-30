import { create } from 'zustand';

export interface Asset {
    id: string;
    name: string;
    type: 'video' | 'image' | 'audio';
    duration: number; // milliseconds
    blobUrl?: string
}

export interface Clip {
    id: string;
    assetId: string;
    type: 'video' | 'image' | 'audio';
    startAt: number //milliseconds
    duration: number;//milliseconds
    // x, y, scales, trim and other properties can be added as needed
}

export interface Track {
    id: string;
    clips: Clip[];
    isMuted: boolean;
    isHidden: boolean;
}

interface EditorState {
    tracks: Track[];
    currentTime: number;
    
    assets: Asset[];
    isPlaying: boolean;
    resolution: {w:number, h:number};

    addTrack: () => void;
    addClipToTrack: (trackId: string, clip: Clip) => void;

    addAsset: (asset: Asset) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setCurrentTime: (time:number) => void;
    setResolution: (w:number, h:number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    tracks: [],
    currentTime: 0,

    assets: [],
    isPlaying: false,
    resolution: {w: 1920, h: 1080},

    addTrack: () =>  set((state) => ({
        tracks: [...state.tracks, {
            id: crypto.randomUUID(),
            clips: [],
            isMuted: false,
            isHidden: false
        }]
     })),

    addClipToTrack: (trackId, clip) => set((state) => ({
        tracks: state.tracks.map(track => 
            track.id === trackId ? { ...track, clips: [...track.clips, clip]}
            : track
        )
    })),

    addAsset: (asset) => set((state) => ({
        assets: [...state.assets, asset]
    })),

    setIsPlaying: (isPlaying) => set({ isPlaying}),

    setCurrentTime: (time) => set({ currentTime: time }),

    setResolution: (w, h) => set({ resolution: { w, h } })
}))