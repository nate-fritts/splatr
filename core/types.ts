import type { Document } from "mongoose";

export type ReferencedDoc<D extends Document> = D["_id"] | D | string;

export interface ISplatrArtist extends Document {
  active: boolean;
  display_name: string;
  offers: ReferencedDoc<ISplatrOffer>[];
}

export interface ISplatrOffer extends Document {}