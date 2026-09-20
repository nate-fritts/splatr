import { SCHEMA_OPTIONS } from "@/data.ts";
import { TimestampedDocument } from "@/types.ts";
import { Schema } from "mongoose";

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