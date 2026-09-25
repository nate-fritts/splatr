import { MArtist } from "@/models.ts";
import type { ApiVariables } from "@/types.ts";
import { generateResponseMetadata, handleApiError } from "@/utils.ts";

import { isArtistDisplayName, ARRAY_MODES, DArtist } from "@splatr/core";
import type { ApiDataResponse, Artist, CreateArtistRequest, UpdateArtistRequest } from "@splatr/core";

import type { Context } from "@hono";
import { isObjectIdOrHexString } from "mongoose";

export const postArtist = async (c:Context<{Variables:ApiVariables}>) => {
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

    return c.json<ApiDataResponse<Artist>>({ _metadata:generateResponseMetadata(c), data:newArtist });

  } catch(e){
    return handleApiError(c, e);
  }
};

export const getArtistById = (c:Context<{Variables:ApiVariables}>) => {
  try {
    const targetArtist = c.get('artist');

    return c.json<ApiDataResponse<DArtist>>({ _metadata:generateResponseMetadata(c), data:targetArtist });
  } catch(e) {
    return handleApiError(c, e);
  }
}

export const patchArtistById = async (c:Context<{Variables:ApiVariables}>) => {
  try {
    const { active, display_name, offers, offers_mode } = await c.req.json<UpdateArtistRequest>(),
          { allowEmptyOffers } = c.req.query(),
          targetArtist = c.get('artist'),
          updateRequest:Partial<Artist> = {},
          offerMode = (offers_mode) && ARRAY_MODES.includes(offers_mode) ? offers_mode : 'merge';

    let updateFlag = false;

    if(typeof active === 'boolean' && targetArtist.active !== active){
      updateRequest.active = active;
      updateFlag = true;
    }

    if(display_name && targetArtist.display_name !== display_name){
      if(typeof display_name !== 'string' || !isArtistDisplayName(display_name)){
        const err = new Error(`request.display_name is invalid.`);
        err.name = 'InvalidParameterError';
        throw err;
      }

      const existingArtists = await MArtist.find({display_name});
      if(existingArtists.length !== 0){
        const err = new Error(`An artist with display_name ${display_name} already exists.`);
        err.name = 'InvalidParameterError';
        throw err;
      }

      updateRequest.display_name = display_name;
      updateFlag = true;
    }

    if(offers && Array.isArray(offers) && (offers.length > 0 && offers.every(o => isObjectIdOrHexString(o)) || (allowEmptyOffers === 'true' && offers.length === 0))){
      // TODO ADD OFFERS LOGIC
      updateRequest.offers = offers;
      updateFlag = true;
    }

    if(!updateFlag){
      const err = new Error('No parameters to update.');
      err.name = 'InvalidParameterError';
      throw err;
    }

    const updatedArtist = await MArtist.findByIdAndUpdate(targetArtist._id, updateRequest, { returnDocument:'after' });

    if(!updatedArtist){
      const err = new Error(`There was a problem updating the artist with _id ${targetArtist._id}`);
      err.name = 'UnspecifiedMongoError';
      throw err;
    }

    return c.json<ApiDataResponse<Artist>>({_metadata:generateResponseMetadata(c), data: updatedArtist});

  } catch(e){
    return handleApiError(c, e);
  }
}

export const deleteArtistById = async (c:Context<{Variables:ApiVariables}>) => {
  try {
    const targetArtist = c.get('artist');

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

export const postArtistOffer = async () => {};

export const getArtistOfferById = async () => {};

export const patchArtistOfferById = async () => {};

export const deleteArtistOfferById = async () => {};