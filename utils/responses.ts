import type { Context, Next } from "@hono";
import { createMiddleware } from "@hono/factory";

export const generateResponseMetadata = createMiddleware(async (c:Context, next:Next)=>{
  const _metadata = {
    timestamp: new Date().toISOString(),
    route: `${c.req.method.toUpperCase()} ${c.req.path.toLowerCase()}`,
    userAgent: `${c.req.header('User-Agent')}`
  };
  c.set('responseMetadata', _metadata);
  await next();
});