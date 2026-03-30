import { ArtistModel } from "../models.ts";
import type { CreateArtistRequest } from '../types/index.ts';
import { generateArtistQuery, isArtistDisplayName } from '../utils/index.ts';
import type { IArtist } from '../types/artists.ts';

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

export async function readArtistById(id:string){
  const query = generateArtistQuery(id);
  return await ArtistModel.findOne(query);
}

export async function updateArtistById(id:string, request:Partial<IArtist>){
  const { active, display_name } = request,
        update:Partial<IArtist> = {},
        target = await readArtistById(id);

  let updateFlag = false;

  if(!target){
    const err = new Error();
    err.name = 'ResourceNotFoundError';
    err.message = 'No matching resource found.';
    throw err;
  }

  if(active && typeof active === 'boolean'){
    update.active = active;
    updateFlag = true;
  }

  if(display_name && isArtistDisplayName(display_name)){
    const existingArtists = await ArtistModel.find({display_name});

    if(existingArtists.length != 0){
      const err = new Error();
      err.name = 'InvalidParameterError';
      err.message = 'Requested display_name:${display_name} is invalid or in use.';
      throw err;
    }

    update.display_name = display_name;
    updateFlag = true;
  }
  
  if(!updateFlag){
    const err = new Error();
    err.name = 'InvalidParameterError';
    err.message = 'No valid properties were updated.';
    throw err;
  }

  const updatedArtist = await ArtistModel.findByIdAndUpdate(target._id, update);

  if(!updatedArtist){
    const err = new Error();
    err.name = 'UnspecifiedError';
    err.message = 'There was an error processing your request.';
    throw err;
  }

  return updatedArtist;
}

export async function deleteArtistById(id:string){}