import type { UUID } from 'node:crypto';

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

// ARTISTS
export type CreateArtistRequest = { display_name:string };