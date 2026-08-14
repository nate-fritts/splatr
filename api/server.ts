import { Hono } from "@hono";
import { secureHeaders } from "@hono/secure-headers";

const Api = new Hono();
Api.use(secureHeaders());

// ARTISTS
import { postArtist, getArtistById, deleteArtistById } from "./route_handlers/artists.ts";

Api.post('/artists', postArtist);
Api.get('/artists/:artistId', getArtistById);
Api.delete('/artists/:artistId', deleteArtistById);

import mongoose, {} from "mongoose";

try {
  // Initialize MongoDB connection with mongoose
  const { href } = new URL(Deno.env.get('API_DB_URL')!);
  await mongoose.connect(href);

  Deno.serve({
    handler: Api.fetch,
    port: (Deno.env.get('API_PORT')) ? Number(Deno.env.get('API_PORT')) : 3000,
    onListen: (addr) => { console.log(`Starting on ${addr.hostname}:${addr.port} at ${Temporal.Now.plainDateTimeISO()}`)}
  });
} catch(e){
  console.error(e);
  Deno.exit(1);
}