import { SArtist, type DArtist } from "@splatr/core";

import { model, type Model } from "mongoose";

export let MArtist:Model<DArtist>;

try {
  MArtist = model<DArtist>('artist');
} catch {
  MArtist = model<DArtist>('artist', SArtist);
}