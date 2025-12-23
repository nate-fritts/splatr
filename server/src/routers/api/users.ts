import { Hono } from "@hono";
import { ApiResponse } from '../../../../types/server.ts';
import { SplatrUser } from '../../app.ts';
import { ISplatrUser } from '../../../../schemas/user.ts';
export const Users = new Hono<{Variables:{metadata:ApiResponse['_metadata']}}>();

Users.get('/', async (c)=>{
  try {
    const { externalId } = c.req.query(),
          foundUsers = await SplatrUser.find<ISplatrUser>({externalId});

    return c.json({_metadata: c.get('metadata'), data:foundUsers}, 200);
  } catch(e){
    throw e;
  }
});

Users.post('/')