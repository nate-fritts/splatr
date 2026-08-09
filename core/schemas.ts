import type { IArtist, IOffer } from "./types.ts";
import { Schema, Types } from "mongoose";

export const SArtist = new Schema<IArtist>({
  active: { type:Boolean, required:true, default:true },
  display_name: { type:String, required:true, unique:true, minLength:4, maxlength:32 },
  offers: [{ type:Types.ObjectId, ref:'offers' }]
}, { timestamps:true });

export const SOffer = new Schema<IOffer>({
  active: { type:Boolean, required:true, default:true },
  name: { type:String, required:true, minLength:6, maxLength:64 },
  value: { type:Number, required:true, min:100, max:1000000 },
  currency: { type:String, minLength:3, maxLength: 3, lowercase:true }
}, { timestamps:true });