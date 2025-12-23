import { createMiddleware } from "@hono/factory";
import { getConnInfo } from "@hono/deno";
import { randomUUID } from "node:crypto";
import { ApiResponse } from '../../../types/server.ts';

export const addResponseMetadata = createMiddleware<{Variables:{metadata: ApiResponse['_metadata']}}>(async (c, next)=> {
  const metadata:ApiResponse['_metadata'] = {
    requestId: randomUUID(),
    requestTime: new Date(),
    actor: {
      ip: getConnInfo(c).remote.address
    }
  };
  c.set('metadata', metadata);
  await next();
});