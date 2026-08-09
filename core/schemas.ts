import type { IArtist, IOffer } from "./types.ts";
import { Schema, Types, type SchemaOptions } from "mongoose";

const options:SchemaOptions = { timestamps:{ createdAt:'created_at', updatedAt:'updated_at' }};

export const SArtist = new Schema<IArtist>({
  active: { type:Boolean, required:true, default:true },
  display_name: { type:String, required:true, unique:true, minLength:4, maxLength:32 },
  description: { type:String, maxLength:512 },
  offers: [{ type:Types.ObjectId, ref:'offers' }]
}, options);

export const SOffer = new Schema<IOffer>({
  active: { type:Boolean, required:true, default:true },
  name: { type:String, required:true, minLength:6, maxLength:64 },
  description: { type:String, required:true, minLength:4, maxLength:1024 },
  value: { type:Number, required:true, min:100, max:1000000 },
  currency: { type:String, minLength:3, maxLength: 3, lowercase:true }
}, options);