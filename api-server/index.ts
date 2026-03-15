// HONO CONFIG
import { Hono } from "@hono";
import { secureHeaders } from "@hono/secure-headers";
import { generateResponseMetadata } from '../utils/index.ts';

const Api = new Hono();
Api.use(secureHeaders());
Api.use(generateResponseMetadata);

// CONNECT DB
import { connect } from "mongoose";

if(!Deno.env.get('DB_URI')) throw new Error('DB_URI is a required variable');
const dbUri = new URL(Deno.env.get('DB_URI')!);
await connect(dbUri.href);

// LOAD ROUTES
import { Artist as ArtistRoutes } from "./routes/artists.ts";
Api.route('/artists', ArtistRoutes);

// START API
Deno.serve({
  port: Deno.env.get('PORT') ? Number(Deno.env.get('PORT')) : 3000,
  handler: Api.fetch
});