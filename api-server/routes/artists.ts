// Configure Router
import { Hono, type Context } from "@hono";
export const Artist = new Hono();
import type { ApiDataResponse, ApiErrorResponse } from '../../types/index.ts';

// Configure DB
import { MongooseError } from "mongoose";
import { createArtist } from '../../handlers/index.ts';
import type { IArtist } from '../../types/index.ts';

Artist.post('/', async (c:Context) => {
  const _metadata = c.get('responseMetadata');

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