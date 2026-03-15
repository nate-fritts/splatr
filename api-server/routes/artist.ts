import { Hono, type Context } from "@hono";
export const Artist = new Hono();

import type { ApiDataResponse } from '../../types/index.ts';

Artist.get('/:id', (c:Context) => {
  return c.json<ApiDataResponse<string>>({_metadata:c.get('responseMetadata'), data:c.req.param('id')});
});