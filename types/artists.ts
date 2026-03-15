import type { Document } from "mongoose";

export interface IArtist extends Document {
  active: boolean;
  display_name: string;
}

export interface CreateArtistRequest {
  display_name: string;
}