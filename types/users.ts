import type { Document } from "mongoose";
import type { ISplatrArtist } from "../schemas/index.ts";

export interface ISplatrUser extends Document {
  externalId: string;
  email: string;
  profile: string;
  artist?: ISplatrArtist | ISplatrArtist['_id'];
}