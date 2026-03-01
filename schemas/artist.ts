import { Schema } from "mongoose";
import type { ISplatrArtist } from '../types/index.ts';

export const SplatrArtistSchema = new Schema<ISplatrArtist>({
  display_name: {
    type: String,
    required: true,
    validate: {
      validator: (s) => (s.length >= 3 && s.length <= 32) ? true : false
    }
  }
});