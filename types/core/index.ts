export interface AlbumSerializer {
    /**
    * @label ID
    */
    id?: number;
    /**
    * @maxLength 128
    */
    name: string;
    songs?: SongSerializer[];
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
    order: number;
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
}

