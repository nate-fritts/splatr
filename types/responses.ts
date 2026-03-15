import { UUID } from 'node:crypto';

import { ISplatrArtist } from "./index.ts";

export interface ApiResponse {
  _metadata: {
    requestId: UUID;
    requestTime: Date | string;
    path: string;
    method: string;
    actor: {
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