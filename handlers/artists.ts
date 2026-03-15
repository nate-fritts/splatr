import { ArtistModel } from "../models.ts";
import type { CreateArtistRequest } from '../types/index.ts';
import { isArtistDisplayName } from '../utils/index.ts';

export async function createArtist(request:CreateArtistRequest){
  const { display_name } = request;
  
  // display_name validation
  if(!display_name || !isArtistDisplayName(display_name.toLowerCase())){
    const err = new Error();
    err.message = 'A required parameter is missing or invalid';
    err.name = 'InvalidParameterError';
    throw err;
  };

  if((await ArtistModel.find({display_name})).length != 0){
    const err = new Error();
    err.message = 'display_name is already in use.';
    err.name = 'NotUniqueError';
    throw err;
  }

  return await ArtistModel.create({display_name:display_name.toLowerCase()});
}