import { Schema } from "mongoose";
import type { IArtist } from '../types/index.ts';

export const ArtistSchema = new Schema<IArtist>({
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