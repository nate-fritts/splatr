import { Document } from "mongoose";
import * as z from "zod";

export function isArtistDisplayName(v:unknown):boolean {
  if(!v || typeof v !== 'string') return false;
  if(typeof v === 'string' && /^[a-z][\w-]{2,31}$/.test(v)) return true;
  return false;
}

export function isEmail(v:unknown):boolean {
  if(!v || typeof v !== 'string') return false;
  if(z.email().safeParse(v)) return true;
  return false;
}

export function isPopulated<T = Document>(v:unknown):v is T {
  if(!v || typeof v !== 'object') return false;
  if(v instanceof Document) return true;
  return false;
}

export function isPopulatedArray<T = Document>(v:unknown[]):v is T[]{
  if(!v || !Array.isArray(v)) return false;
  if(v.every(i => i instanceof Document)) return true;
  return false;
}

export function isUrl(v:unknown):boolean {
  if(!v || typeof v !== 'string') return false;
  if(z.url().safeParse(v)) return true;
  return false;
}