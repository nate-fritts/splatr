import { type Document, Types } from "mongoose";

/**
 * A Mongoose {@link Document} with the methods and other metadata removed, except for `_id`, `createdAt`, `updatedAt`, or `__v`
 */
export type ReducedDoc<T extends TimestampedDocument> = T & Required<{ _id:Types.ObjectId }>;

export type ReferencedDoc<T extends TimestampedDocument> = T["_id"] | T | string;

export interface TimestampedDocument extends Document {
  created_at: Temporal.PlainDateTimeLike;
  updated_at: Temporal.PlainDateTimeLike;
}

export interface IArtist extends TimestampedDocument {
  active: boolean;
  display_name: string;
  description?: string;
  offers: ReferencedDoc<IOffer>[];
}

export interface IOffer extends TimestampedDocument {
  active: boolean;
  name: string;
  description?: string;
  value: number;
  /**
   * Lowercase representation of the [ISO-4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes_(list_one)) currency code.
   */
  currency: string;
}