export interface Player {
    id: number;
    name: string;
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    rating: number;
    photo: string;
    stats: {
        pac: number;
        sho: number;
        pas: number;
        dri: number;
        def: number;
        phy: number;
    };
}
