export interface PlaylistSerializer {
    /**
    * @label ID
    */
    id?: number;
    /**
    * @maxLength 128
    */
    name: string;
    songs?: SongSerializer[];
    /**
    * @format date-time
    */
    created?: string;
    /**
    * @format date-time
    */
    modified?: string;
}

export interface SongSerializer {
    /**
    * @label ID
    */
    id?: number;
    /**
    * @maxLength 128
    */
    name: string;
    file: File;
    preview_file?: File | null;
    slug?: string;
    waveform?: any | null;
    playlist?: number | string | null;
    versions?: VersionSerializer[];
    /**
    * @format date-time
    */
    created?: string;
    /**
    * @format date-time
    */
    modified?: string;
}

export interface VersionSerializer {
    /**
    * @label ID
    */
    id?: number;
    /**
    * @maxLength 128
    */
    name: string;
    file: File;
    preview_file?: File | null;
    slug?: string;
    song: number | string;
    waveform?: any | null;
    /**
    * @format date-time
    */
    created?: string;
    /**
    * @format date-time
    */
    modified?: string;
}

