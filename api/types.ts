import type { UUID } from 'node:crypto';
import { IArtist, TimestampedDocument } from "@splatr/core";

export interface ApiResponse {
  _metadata: {
    request_id: UUID;
    request_time: Temporal.PlainDateTimeLike;
    route: string;
    user_agent: string;
    actor?: {
      ip?: string;
    }
  }
}

export type ApiDataResponse<D> = ApiResponse & { data: D };
export type ApiErrorResponse<E = Error> = ApiResponse & { error: E };

export type ApiVariables = { artist:IArtist };

// ARTISTS
export type UpdateArtistRequest = Omit<IArtist, keyof TimestampedDocument>
export type CreateArtistRequest = Omit<UpdateArtistRequest, "active" | "offers" >;