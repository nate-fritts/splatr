// LOAD DB MODELS
import { model } from "mongoose";
import { ArtistSchema } from "./schemas/index.ts";
export const ArtistModel = model('Artist', ArtistSchema);