import * as z from "zod";

export function isEmail(s:string):boolean {
  try {
    z.email().parse(s);
    return true;
  } catch(_err){
    return false;
  }
}

export function isUrl(s:string):boolean {
  try{
    z.url({
      protocol: /^https$/,
      hostname: z.regexes.domain
    }).parse(s);

    return true;
  } catch(_err){
    return false;
  }
}