// HONO CONFIG
import { Hono } from "@hono";
import { secureHeaders } from "@hono/secure-headers";
import { generateResponseMetadata } from '../utils/index.ts';

const Api = new Hono();
Api.use(secureHeaders());
Api.use(generateResponseMetadata);

// CONNECT DB
import { connect, model } from "mongoose";

if(!Deno.env.get('DB_URI')) throw new Error('DB_URI is a required variable');
const dbUri = new URL(Deno.env.get('DB_URI')!);
await connect(dbUri.href);

// LOAD DB MODELS
import { ArtistSchema } from "../schemas/index.ts";
export const Artist = model('Artist', ArtistSchema);

// LOAD ROUTES
import { Artist as ArtistRoutes } from "./routes/artist.ts";
Api.route('/api/artist', ArtistRoutes);

// START API
Deno.serve({
  port: Deno.env.get('PORT') ? Number(Deno.env.get('PORT')) : 3000,
  handler: Api.fetch
});