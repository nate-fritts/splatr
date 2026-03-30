// Local imports
import { createArtist, readArtistById, updateArtistById, deleteArtistById } from '../handlers/index.ts';
import { ArtistModel } from "../models.ts";
import type { IArtist } from '../types/index.ts';
import { generateArtistQuery, generateResponseMetadata } from '../utils/index.ts';
import type { ApiDataResponse, ApiErrorResponse } from '../types/index.ts';

// Configure Router
import { Hono, type Context, type Next } from "@hono";
import { createMiddleware } from "@hono/factory";
export const Artist = new Hono();

// Configure DB
import { MongooseError } from "mongoose";

Artist.post('/', async (c:Context) => {
  const _metadata = generateResponseMetadata(c);
  try {
    // Extract request parameters
    const { display_name } = await c.req.json(),
          // Send to handler for validation and creation
          newArtist = await createArtist({display_name});
    
    return c.json<ApiDataResponse<IArtist>>({_metadata, data:newArtist.toJSON()}, 200);
  
  } catch(e){
    console.error(e);
    const err = (e instanceof MongooseError) ? { name:'InvalidParameterError', message:'A required parameter is missing or invalid' } : <Error>e; // Resets raw database errors
    return c.json<ApiErrorResponse>({_metadata, error: err}, 400);
  }
});

const queryArtist = createMiddleware<{ Variables:{ artist?:IArtist }}>(async (c:Context, next:Next)=>{
  const { id } = c.req.param(),
        query = generateArtistQuery(id),
        target = await ArtistModel.findOne(query);

  if(!target) return c.text('404 NOT FOUND', 404);
  c.set('artist', target);
  await next();
});

Artist.use('/:id', queryArtist);

Artist.get('/:id', (c:Context)=>{
  const _metadata = generateResponseMetadata(c);
  try {
    // Extract from middleware
    const artist = <IArtist>c.get('artist');
    return c.json<ApiDataResponse<IArtist>>({_metadata, data:artist.toJSON()});
  } catch(e){
    console.error(e);
    const err = (e instanceof MongooseError) ? { name:'InvalidParameterError', message:'A required parameter is missing or invalid' } : <Error>e; // Resets raw database errors
    return c.json<ApiErrorResponse>({_metadata, error: err}, 400);
  }
});

Artist.patch('/:id', async (c:Context)=>{
  const _metadata = generateResponseMetadata(c);
  try {
    const { _id } = <IArtist>c.get('artist'),
          update = await c.req.json<Partial<IArtist>>();

    const updatedArtist = await updateArtistById(_id.toString(), update);
    return c.json<ApiDataResponse<IArtist>>({_metadata, data:updatedArtist.toJSON()}, 200);

  } catch(e){
    console.error(e);
    const err = (e instanceof MongooseError) ? { name:'InvalidParameterError', message:'A required parameter is missing or invalid' } : <Error>e; // Resets raw database errors
    return c.json<ApiErrorResponse>({_metadata, error: err}, 400);
  }
});

Artist.delete('/:id', async (c:Context)=>{});