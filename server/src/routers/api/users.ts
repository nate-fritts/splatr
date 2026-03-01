import { Hono } from "@hono";
import { ApiResponse } from '../../../../types/server.ts';
import { SplatrArtist } from '../../app.ts';

export const Users = new Hono<{Variables:{metadata:ApiResponse['_metadata']}}>();

Users.get('/', async (c)=>{
  const _metadata = c.get('metadata'),
        { externalId } = c.req.query(),
        query:Record<string, string> = {};
  try {
    if(!externalId || typeof externalId != 'string' || externalId.length > 32){
      const err = new Error('externalId is malformed');
      err.name = 'InvalidParameterError';
      throw err;
    }
    query.externalId = externalId;
    const foundUsers = await SplatrArtist.find(query);
    
  } catch(e){
    return c.json({_metadata, error:e}, 400);
  }

  // try {
  //   const { externalId } = c.req.query();

  //   if(!externalId) return c.json({_metadata:})
  //         foundUsers = await SplatrUser.find({externalId});

  //   return c.json({_metadata: c.get('metadata'), data:foundUsers}, 200);
  // } catch(e){
  //   throw e;
  // }
});