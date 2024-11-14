export interface Track {
    TrackId: number;
    trackname: string;
    albumId: number;
    albumTitel: string;
    artistID: number;
    artistName: string;
    genre: string;
  }

 export interface ProdData { 
    ID: number;
    Fertigungsnummer: string;
    Place: string;
    Group: string;
    row: number;
    column: number;
 }