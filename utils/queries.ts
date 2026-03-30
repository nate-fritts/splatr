import { isObjectIdOrHexString } from 'mongoose';
import { isArtistDisplayName } from './index.ts';

/**
 * Attempts to construct a simple IArtist query for either the `_id` or `display_name` properties depending on the format.
 */
export function generateArtistQuery(value:string):{ _id?:string, display_name?:string }{
  try {
    const query = (isObjectIdOrHexString(value)) ? {_id:value} : (isArtistDisplayName(value)) ? { display_name:value }: null;
    if(!query) throw null;
    return query;
  } catch(_e){
    const err = new Error();
    err.message = `Provided value: ${value} is neither an Artist _id nor display_name`;
    err.name = 'InvalidParameterError';
    throw err;
  }
}