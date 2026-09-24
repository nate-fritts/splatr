import type { ApiErrorResponse, ApiResponse } from "@splatr/core";

import { randomUUID } from "node:crypto";

import type { Context, Next } from "@hono";
import { createMiddleware } from "@hono/factory";
import { MongooseError } from "mongoose";

// RESPONSES

export const generateResponseMetadata = (c:Context):ApiResponse['_metadata'] => {
  return {
    request_id: randomUUID(),
    request_time: Temporal.Now.plainDateTimeISO(),
    route: `${c.req.method.toUpperCase()} ${c.req.path.toLowerCase()}`,
    user_agent: `${c.req.header('User-Agent')}`
  };
};

export const generateResponseMetadataMiddleware = createMiddleware(async (c:Context, next:Next)=>{
  const _metadata = generateResponseMetadata(c);
  c.set('responseMetadata', _metadata);
  await next();
});

export const handleApiError = (c:Context, e:unknown) => {
  console.error(e);
  const err = (e instanceof MongooseError) ? { name:'InvalidParameterError', message:'A required parameter is missing or invalid' } : <Error>e; // Resets raw database errors
  return c.json<ApiErrorResponse>({_metadata:generateResponseMetadata(c), error: {name:err.name, message:err.message}}, 400);
};

// SORTERS