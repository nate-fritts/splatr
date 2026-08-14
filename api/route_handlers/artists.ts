import { IArtist, isArtistDisplayName } from "@splatr/core";
import { MArtist } from "../models.ts";
import { ApiDataResponse, ApiResponse, type CreateArtistRequest } from "../types.ts";
import { generateResponseMetadata, handleApiError, sortDocument } from "../utils.ts";

import type { Context } from "@hono";
import { isObjectIdOrHexString } from "mongoose";

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

export async function getArtistById(c:Context){
  try {
    const { artistId } = c.req.param();

    if(!artistId || !isObjectIdOrHexString(artistId)){
      const err = new Error('artistId is missing or invalid.');
      err.name = 'InvalidParameterError';
      throw err;
    }

    const foundArtist = await MArtist.findById(artistId);

    if(!foundArtist) return c.text('404 NOT FOUND', 404);

    return c.json<ApiDataResponse<IArtist>>({ _metadata:generateResponseMetadata(c), data:sortDocument<IArtist>(foundArtist)});

  } catch(e){
    return handleApiError(c, e);
  }
}

export async function deleteArtistById(c:Context){
  try {
    const { artistId } = c.req.param();

    if(!artistId || !isObjectIdOrHexString(artistId)){
      const err = new Error('artistId is missing or invalid.');
      err.name = 'InvalidParameterError';
      throw err;
    }

    const targetArtist = await MArtist.findById(artistId);

    if(!targetArtist) return c.text('404 NOT FOUND', 404);

    const deletedArtist = await MArtist.findByIdAndDelete(targetArtist._id);

    if(!deletedArtist){
      const err = new Error(`There was an error deleting the artist with id ${targetArtist._id}`);
      err.name = 'UnspecifiedMongoError';
      throw err;
    }

    // TODO: Decide how to handle DELETE operations and the metadata from them
    console.dir(generateResponseMetadata(c));

    return c.body(null, 204);
  } catch(e) {
    return handleApiError(c, e);
  }
}