import { Schema } from "mongoose";
import type { ISplatrArtist } from '../types/index.ts';

export const ArtistSchema:Schema<ISplatrArtist> = new Schema<ISplatrArtist>({
  active: { type: Boolean, default:true, required:true },
  display_name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (s) => (s.length >= 3 && s.length <= 32) ? true : false
    }
  }
}, { timestamps:true });