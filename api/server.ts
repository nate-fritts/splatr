import { IArtist } from "@splatr/core";

import { Hono } from "@hono";
import { secureHeaders } from "@hono/secure-headers";

const Api = new Hono<{Variables:{ artist?:IArtist }}>();
Api.use(secureHeaders());

// ARTISTS
import { postArtist, getArtistById, deleteArtistById, patchArtistById } from "./route_handlers/artists.ts";
import { setArtistVar } from "./middleware.ts";

Api.post('/artists', postArtist);
Api.use('/artists/:artistId', setArtistVar);
Api.get('/artists/:artistId', getArtistById);
Api.patch('/artists/:artistId', patchArtistById);
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