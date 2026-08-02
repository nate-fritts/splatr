import type { UUID } from 'node:crypto';

import type { ISplatrArtist } from "./index.ts";

export interface ApiResponse {
  _metadata: {
    request_id: UUID;
    request_time: Date | string;
    route: string;
    user_agent: string;
    actor?: {
      ip?: string;
    }
  }
}

export interface ApiDataResponse<D> extends ApiResponse{
  data: D;
}

export interface ApiErrorResponse<E = Error> extends ApiResponse {
  error: E;
}

export interface LocalVars {
  artist: ISplatrArtist;
  path: string;
};