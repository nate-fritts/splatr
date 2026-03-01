import { Schema, Types } from 'mongoose';
import type { ISplatrUser } from '../types/index.ts';
import { isEmail, isUrl } from '../utils/index.ts';

export const SplatrUserSchema = new Schema<ISplatrUser>({
  externalId: {
    type: String,
    required: true,
    immutable:true,
    unique: true
  },
  email: {
    type: String,
    required:true,
    validate: {
      validator: isEmail,
      message:'user.email is invalid'
    }
  },
  profile: {
    type: String,
    validate: isUrl
  },
  artist: {
    type: Types.ObjectId,
    ref: 'Artist'
  }
});