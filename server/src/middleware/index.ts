import { createMiddleware } from '@hono/factory';
import { getSignedCookie } from '@hono/cookie';
import { SplatrUser, envVars } from '../app.ts';
import type { ISplatrArtist, ISplatrUser, LocalVars } from '../../../types/index.ts';

export const setLocalVars = createMiddleware<{Variables:LocalVars}>(async (c, next)=>{
  try {
    
    const userId = await getSignedCookie(c, envVars.signing_key, 'splatr_sid'),
          user = await SplatrUser.findById(userId).populate<{artist:ISplatrArtist}>('artist');

    c.set('path', c.req.path);
          
    if(c.req.path.includes('/console') && (!userId || !user)) return c.redirect(new URL(`?ref=${c.req.path}`,'/login'));

    if(user){
      c.set('user', user);
      if(user.artist) c.set('artist', user.artist);
    }

    await next();
  } catch(e){
    throw e;
  }
});