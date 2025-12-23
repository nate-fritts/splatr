import { UUID } from 'node:crypto';

export interface ApiResponse {
  _metadata: {
    requestId: UUID;
    requestTime: Date | string;
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