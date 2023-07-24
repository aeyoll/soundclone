export interface PlaylistSerializer {
    /**
    * @label ID
    */
    id?: number;
    /**
    * @maxLength 128
    */
    name: string;
    songs: SongSerializer[];
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
    slug?: string;
    waveform?: any | null;
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
    slug?: string;
    /**
    * @format date-time
    */
    created?: string;
    /**
    * @format date-time
    */
    modified?: string;
}

