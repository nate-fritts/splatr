import { SArtist, type IArtist } from "@splatr/core";

import { model, type Model } from "mongoose";

export let MArtist:Model<IArtist>;

try {
  MArtist = model<IArtist>('artist');
} catch {
  MArtist = model<IArtist>('artist', SArtist);
}