import { IArtist, isArtistDisplayName } from "@splatr/core";
import { MArtist } from "../models.ts";
import { ApiDataResponse, type CreateArtistRequest } from "../types.ts";
import { generateResponseMetadata, handleApiError, sortDocument } from "../utils.ts";
import type { Context } from "@hono";

export async function postArtist(c:Context){
  try {
    const request = await c.req.json<CreateArtistRequest>();

    if(!request) throw new Error('requestBody is required on this route.');

    const { display_name, description } = request;

    // display_name validation
    if(!display_name || !isArtistDisplayName(display_name.toLowerCase())){
      const err = new Error('A required parameter is missing or invalid');
      err.name = 'InvalidParameterError';
      throw err;
    };
  
    if((await MArtist.find({display_name})).length != 0){
      const err = new Error('request.display_name is already in use.');
      err.name = 'NotUniqueError';
      throw err;
    };

    const artistRequest:Partial<CreateArtistRequest> = { display_name:display_name.toLowerCase() };

    if(description) artistRequest.description = description.substring(0, 1023);

    const newArtist = await MArtist.create(artistRequest);

    if(!newArtist){
      const err = new Error('There was an error creating a new SArtist document.');
      err.name = 'UnspecifiedMongoError';
      throw err;
    }

    return c.json<ApiDataResponse<IArtist>>({ _metadata:generateResponseMetadata(c), data:sortDocument<IArtist>(newArtist) });

  } catch(e){
    return handleApiError(c, e);
  }
}