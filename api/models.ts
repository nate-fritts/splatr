import { SSplatrArtist, type ISplatrArtist } from "@splatr/core";

import { model, type Model } from "mongoose";

export let MSplatrArtist:Model<ISplatrArtist>;

try {
  MSplatrArtist = model<ISplatrArtist>('SplatrArtist');
} catch {
  MSplatrArtist = model<ISplatrArtist>('SplatrArtist', SSplatrArtist);
}