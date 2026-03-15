import type { Document } from "mongoose";

export interface IArtist extends Document {
  display_name: string;
}