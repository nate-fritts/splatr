// Local imports
import { createArtist, readArtistById, updateArtistById, deleteArtistById } from '../handlers/index.ts';
import { ArtistModel } from "../models.ts";
import type { ApiDataResponse, ApiResponse, EnvConfig, ISplatrArtist } from '../types/index.ts';
import { generateArtistQuery, generateResponseMetadata, handleApiError } from '../utils/index.ts';

// Configure Router
import { Hono, type Context, type Next } from "@hono";
import type { BlankSchema } from "@hono/types";
import { createMiddleware } from "@hono/factory";
export const Artist:Hono<EnvConfig, BlankSchema, "/"> = new Hono<EnvConfig>();

Artist.use(createMiddleware<{ Variables:{ _metadata:ApiResponse['_metadata'] }}>(async(c:Context, next:Next)=>{
  c.set('_metadata', generateResponseMetadata(c));
  await next();
}));

Artist.post('/', async (c:Context) => {
  try {
    // Extract request parameters
    const _metadata = c.get('_metadata'),
          { display_name } = await c.req.json(),
          // Send to handler for validation and creation
          newArtist = await createArtist({display_name});
    
    return c.json<ApiDataResponse<ISplatrArtist>>({_metadata, data:newArtist.toJSON()}, 200);
  
  } catch(e){
    return handleApiError(c, <Error>e);
  }
});

const queryArtist = createMiddleware(async (c:Context, next:Next)=>{
  const { id } = c.req.param(),
        query = generateArtistQuery(id),
        target = await ArtistModel.findOne(query);

  if(!target) return c.text('404 NOT FOUND', 404);
  c.set('artist', target);
  await next();
});

Artist.use('/:id', queryArtist);

Artist.get('/:id', async (c:Context)=>{
  try {
    const _metadata = c.get('_metadata'),
          { _id } = <ISplatrArtist>c.get('artist'),
          artist = await readArtistById(_id.toString());
    if(!artist) return c.text('404 NOT FOUND', 404);
    return c.json<ApiDataResponse<ISplatrArtist>>({_metadata, data:artist.toJSON()});
  } catch(e){
    return handleApiError(c, <Error>e);
  }
});

Artist.patch('/:id', async (c:Context)=>{
  try {
    const  _metadata = c.get('_metadata'),
          { _id } = <ISplatrArtist>c.get('artist'),
          update = await c.req.json<Partial<ISplatrArtist>>();

    const updatedArtist = await updateArtistById(_id.toString(), update);
    return c.json<ApiDataResponse<ISplatrArtist>>({_metadata, data:updatedArtist.toJSON()}, 200);

  } catch(e){
    return handleApiError(c, <Error>e);
  }
});

Artist.delete('/:id', async (c:Context)=>{
  try {
    const _metadata = c.get('_metadata'),
          { _id } = <ISplatrArtist>c.get('artist'),
          deletedArtist = await deleteArtistById(_id.toString());

    return c.json<ApiDataResponse<ISplatrArtist>>({_metadata, data:deletedArtist.toJSON()}, 200);
  } catch(e){
    return handleApiError(c, <Error>e);
  }
});