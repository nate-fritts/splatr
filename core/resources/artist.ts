import type { ArrayMode } from "@/types.ts";
import type { ReferencedDocument, TimestampedDocument } from "@/types.ts";
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

export type ArtistOffer = {
  active: boolean;
  name: string;
  description?: string;
  value: number;
  /**
   * Lowercase representation of the [ISO-4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes_(list_one)) currency code.
   */
  currency: string;
};

export type DArtistOffer = ArtistOffer & TimestampedDocument;

export const SArtistOffer = new Schema<DArtistOffer>({
  active: { type:Boolean, required:true, default:true },
  name: { type:String, required:true, minLength:6, maxLength:64 },
  description: { type:String, required:true, maxLength:512 },
  value: { type:Number, required:true, min:100, max:1000000 },
  currency: { type:String, minLength:3, maxLength: 3, lowercase:true }
}, SCHEMA_OPTIONS);