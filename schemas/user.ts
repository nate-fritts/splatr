import { Schema, Types, type Document } from 'mongoose';
import { isEmail, isUrl } from '../utils/validators.ts';

export interface ISplatrUser extends Document {
  externalId: string;
  email: string;
  profile: URL['href'];
  artist?: string;
}

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