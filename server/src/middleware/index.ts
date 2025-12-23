import { createMiddleware } from '@hono/factory';
import { getSignedCookie } from '@hono/cookie';
import { SplatrUser } from '../app.ts';
import { ISplatrUser } from '../../../schemas/user.ts';

export interface LocalVars {
  user: ISplatrUser;
  path: string;
};

export const setLocalVars = createMiddleware<{Variables:LocalVars}>(async (c, next)=>{
  try {
    c.set('path', c.req.path);
    const userId = await getSignedCookie(c, Deno.env.get('SIGNING_KEY')!, 'splatr_sid'),
          user = await SplatrUser.findById(userId);
          
    if(c.req.path.includes('/console') && (!userId || !user)) return c.redirect(new URL(`?ref=${c.req.path}`,'/login'));

    if(user){
      c.set('user', user);
    }
    await next();
  } catch(e){
    throw e;
  }
});