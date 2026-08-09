import type { Document } from "mongoose";

export type ReferencedDoc<D extends Document> = D["_id"] | D | string;

export interface IArtist extends Document {
  active: boolean;
  display_name: string;
  offers: ReferencedDoc<IOffer>[];
}

export interface IOffer extends Document {
  active: boolean;
  name: string;
  value: number;
  /**
   * Lowercase representation of the [ISO-4217](https://en.wikipedia.org/wiki/ISO_4217#Active_codes_(list_one)) currency code.
   */
  currency: string;
}