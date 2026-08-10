import type { ISplatrArtist } from "./artists.ts";
import type { ApiResponse } from "../api/types.ts";
import type { Env } from "@hono/types";

export type { CreateArtistRequest, ISplatrArtist } from "./artists.ts";
export type { ApiResponse, ApiDataResponse, ApiErrorResponse, LocalVars } from "../api/types.ts";

export interface EnvConfig extends Env {
  Variables: {
    _metadata?: ApiResponse["_metadata"];
    artist?: ISplatrArtist;
  }
}