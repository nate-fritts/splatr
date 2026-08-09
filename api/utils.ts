import type { Context, Next } from "@hono";
import { createMiddleware } from "@hono/factory";
import { randomUUID } from "node:crypto";
import { MongooseError } from "mongoose";
import type { ApiErrorResponse, ApiResponse } from './types.ts';

export function generateResponseMetadata(c:Context):ApiResponse['_metadata']{
  return {
    request_id: randomUUID(),
    request_time: Temporal.Now.plainDateTimeISO(),
    route: `${c.req.method.toUpperCase()} ${c.req.path.toLowerCase()}`,
    user_agent: `${c.req.header('User-Agent')}`
  };
}

export const generateResponseMetadataMiddleware = createMiddleware(async (c:Context, next:Next)=>{
  const _metadata = generateResponseMetadata(c);
  c.set('responseMetadata', _metadata);
  await next();
});

export function handleApiError(c:Context, e:Error){
  console.error(e);
  const err = (e instanceof MongooseError) ? { name:'InvalidParameterError', message:'A required parameter is missing or invalid' } : <Error>e; // Resets raw database errors
  return c.json<ApiErrorResponse>({_metadata:c.get('_metadata'), error: err}, 400);
}