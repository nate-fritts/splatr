import type { ISplatrArtist } from "./types.ts";
import { Schema, Types } from "mongoose";

export const SSplatrArtist = new Schema<ISplatrArtist>({
  active: { type:Boolean, required:true, default:true },
  display_name: { type:String, required:true, unique:true, minLength:4, maxlength:32 },
  offers: [{ type:Types.ObjectId, ref:'SplatrOffers' }]
}, { timestamps:true });