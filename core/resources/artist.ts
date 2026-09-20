import type { ArrayMode } from "@/types.ts";
import type { ReferencedDocument, TimestampedDocument } from "@/types.ts";
import type { DArtistOffer } from "@/resources/artistOffer.ts";
import { SCHEMA_OPTIONS } from "@/data.ts";

import { Schema, Types } from "mongoose";

export type Artist = {
  active: boolean;
  display_name: string;
  description?: string;
  offers: ReferencedDocument<DArtistOffer>[];
};

export type DArtist = Artist & TimestampedDocument;

export const SArtist = new Schema<DArtist>({
  active: { type:Boolean, required:true, default:true },
  display_name: { type:String, required:true, unique:true, minLength:4, maxLength:32 },
  description: { type:String, maxLength:512 },
  offers: [{ type:Types.ObjectId, ref:'artist_offers' }]
}, SCHEMA_OPTIONS);

export type UpdateArtistRequest = Artist & {
  /**
   * How the request.offers property is handled. If
   */
  offers_mode?: ArrayMode
};

export type CreateArtistRequest = Omit<UpdateArtistRequest, "active" | "offers" >;