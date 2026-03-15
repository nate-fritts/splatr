import * as z from "zod";

export function isArtistDisplayName(s:string):boolean {
  if(typeof s === 'string' && /^[a-z][\w-]{2,31}$/.test(s)) return true;
  return false;
}

export function isEmail(s:string):boolean {
  if(z.email().safeParse(s)) return true;
  return false;
}

export function isUrl(s:string):boolean {
  if(z.url().safeParse(s)) return true;
  return false;
}