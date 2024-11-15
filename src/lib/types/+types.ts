export type Track = {
    trackId: number;
    trackName: string;
    albumId: number;
    albumTitle: string;
    artistId: number;
    artistName: string;
    genre: string;
};
// export interface PageData {
//     tracks: any[]; // Adjust the type according to your data structure
//   }
export type ProdData = { // statt interface "Type ... =" verwenden
    ID: number;
    Fertigungsnummer: string;
    Place: string;
    Group: string;
    row: number;
    column: number;
    camera: number;
};