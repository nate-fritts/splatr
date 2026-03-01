import * as z from "zod";

export function isEmail(s:string):boolean {
  if(z.email().safeParse(s)) return true;
  return false;
}

export function isUrl(s:string):boolean {
  if(z.url().safeParse(s)) return true;
  return false;
}