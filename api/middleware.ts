import { MArtist } from "./models.ts";
import type { Context, Next } from "@hono";
import { isObjectIdOrHexString } from "mongoose";
import { handleApiError } from "./utils.ts";

export const setArtistVar = async (c:Context, next:Next) => {
  try {
    const { artistId } = c.req.param();

    if(!artistId || !isObjectIdOrHexString(artistId)){
      const err = new Error('artistId is missing or invalid.');
      err.name = 'InvalidParameterError';
      throw err;
    }

    const foundArtist = await MArtist.findById(artistId);

    if(!foundArtist) return c.text('404 NOT FOUND', 404);

    c.set('artist', foundArtist);

    await next();

    return;

  } catch(e){
    return handleApiError(c, e);
  }
};