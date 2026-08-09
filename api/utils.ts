import type { ReducedDoc, TimestampedDocument } from "@splatr/core";
import type { ApiErrorResponse, ApiResponse } from './types.ts';

import { randomUUID } from "node:crypto";

import type { Context, Next } from "@hono";
import { createMiddleware } from "@hono/factory";
import { MongooseError } from "mongoose";

// RESPONSES

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

export function handleApiError(c:Context, e:unknown){
  console.error(e);
  const err = (e instanceof MongooseError) ? { name:'InvalidParameterError', message:'A required parameter is missing or invalid' } : <Error>e; // Resets raw database errors
  return c.json<ApiErrorResponse>({_metadata:generateResponseMetadata(c), error: {name:err.name, message:err.message}}, 400);
}

// SORTERS

export function sortDocument<T extends TimestampedDocument>(d:T):ReducedDoc<T>{
  const { _id, created_at, updated_at, __v, ...rest } = d.toJSON<T>();
  const response:Partial<TimestampedDocument> = { _id, ...rest };

  if(created_at) response.created_at = created_at;
  if(updated_at) response.updated_at = updated_at;

  return <ReducedDoc<T>>({ ...response, __v } as unknown);
}