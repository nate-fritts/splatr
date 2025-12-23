import { Hono } from '@hono';
import { LocalVars } from '../../middleware/index.ts';
export const Console = new Hono<{Variables:LocalVars}>();

import * as ejs from "ejs";
import { viewsRoot } from '../../app.ts';

Console.get('/', (c)=>{
  try {
    const html = ejs.renderFile(`${viewsRoot}/console/index.ejs`, {user:c.var.user, title:'Console'});
    return c.html(html, 200);
  } catch(e){
    throw e;
  }
});