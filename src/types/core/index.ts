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
    versions?: VersionSerializer[];
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
}

