import type { Document } from "mongoose";

// GENERAL

export type ArrayMode = typeof ARRAY_MODES[number];

// MONGOOSE

export type ReferencedDocument<T extends TimestampedDocument> = T["_id"] | T | string;

export interface TimestampedDocument extends Document {
  created_at: Temporal.PlainDateTimeLike;
  updated_at: Temporal.PlainDateTimeLike;
}

// RESPONSES

import type { UUID } from "node:crypto";
import { ARRAY_MODES } from "@/data.ts";

export interface ApiResponse {
  _metadata: {
    request_id: UUID;
    request_time: Temporal.PlainDateTimeLike;
    route: string;
    user_agent: string;
    actor?: {
      id: string;
      scope_matched: string;
      ip?: string;
    }
  }
}

export type ApiDataResponse<D> = ApiResponse & { data: D };
export type ApiErrorResponse<E = Error> = ApiResponse & { error: E };