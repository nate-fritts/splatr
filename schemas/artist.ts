import { Schema, Types, type Document } from "mongoose";

export interface ISplatrArtist extends Document {
  displayName: string;
}

export const SplatrArtistSchema = new Schema<ISplatrArtist>({
  
});