import type { Context, Next } from "@hono";
import { createMiddleware } from "@hono/factory";
import { randomUUID } from "node:crypto";
import type { ApiResponse } from '../types/responses.ts';

export function generateResponseMetadata(c:Context):ApiResponse['_metadata']{
  return {
    request_id: randomUUID(),
    request_time: new Date().toISOString(),
    route: `${c.req.method.toUpperCase()} ${c.req.path.toLowerCase()}`,
    user_agent: `${c.req.header('User-Agent')}`
  };
}

export const generateResponseMetadataMiddleware = createMiddleware(async (c:Context, next:Next)=>{
  const _metadata = generateResponseMetadata(c);
  c.set('responseMetadata', _metadata);
  await next();
});