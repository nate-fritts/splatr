import type { Document } from "mongoose";

export interface ISplatrArtist extends Document {
  active: boolean;
  display_name: string;
}

export interface CreateArtistRequest {
  display_name: string;
}