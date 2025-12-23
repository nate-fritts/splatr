import { App } from "./src/app.ts";

try {
  Deno.serve({ port: 8000 }, App.fetch);
} catch(e){
  console.dir(e);
}