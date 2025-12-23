import { Hono } from "@hono";
import { secureHeaders } from "@hono/secure-headers";
import { setSignedCookie, deleteCookie } from "@hono/cookie";
import { serveStatic } from "@hono/deno";
import { setLocalVars, type LocalVars } from './middleware/index.ts';

// APP CONFIG
export const App = new Hono<{Variables:LocalVars}>();
App.use(secureHeaders());

// ENV CONFIG
import z, { type ZodError } from "zod";
export const EnvVarsSchema = z.strictObject({
  api: z.object({
    base_uri: z.url()
  }),
  mongodb_uri: z.url({protocol:/^mongodb(?:\+srv)?$/}),
  signing_key: z.string(),
  oidc: z.strictObject({
    aud: z.url(),
    client_id: z.string(),
    client_secret: z.string(),
    iss: z.url(),
    redirect_uri: z.url()
  }),
  views_root: z.string()
});

export const envVars:z.infer<typeof EnvVarsSchema> = {
  api: {
    base_uri: Deno.env.get('API_BASE_URI')!
  },
  mongodb_uri: Deno.env.get('MONGODB_URI')!,
  signing_key: Deno.env.get('SIGNING_KEY')!,
  oidc: {
    aud: Deno.env.get('OIDC_AUD')!,
    client_id: Deno.env.get('OIDC_CLIENT_ID')!,
    client_secret: Deno.env.get('OIDC_CLIENT_SECRET')!,
    iss: Deno.env.get('OIDC_ISS')!,
    redirect_uri: Deno.env.get('OIDC_REDIRECT_URI')!
  },
  views_root: Deno.env.get('VIEWS_ROOT')!
};

try {
  EnvVarsSchema.parse(envVars);
} catch(e){
  const err = <ZodError>e;
  console.error(err);
  throw err;
}

const {
  api,
  mongodb_uri,
  signing_key,
  oidc,
  views_root
} = envVars;

// Auth Config
import * as OidcClient from "@panva/openid-client";
import * as Jose from "@panva/jose";
const { jwtVerify } = Jose;

const { discovery } = OidcClient,
      OidcServer = await discovery(new URL(oidc.iss), oidc.client_id);

const { authorization_endpoint, token_endpoint, userinfo_endpoint } = OidcServer.serverMetadata();

if(!authorization_endpoint || !token_endpoint || !userinfo_endpoint) throw new Error('Oidc Server not found.');

const OidcParams = new URLSearchParams({
  audience: oidc.aud,
  client_id: oidc.client_id,
  redirect_uri: oidc.redirect_uri,
  response_type: 'code',
  scope: 'offline_access openid profile picture email'
});

const OidcRedirect = new URL(`?${OidcParams}`, authorization_endpoint);

// DB Config
import { connect, model, type MongooseError } from "mongoose";

try {
  await connect(mongodb_uri);
} catch(e){
  const err = <MongooseError>e;
  console.error(err);
  throw err.message;
}

import { ISplatrUser, SplatrUserSchema } from "../../schemas/user.ts";
import { SplatrArtistSchema } from "../../schemas/artist.ts";

export const SplatrUser = model('Users', SplatrUserSchema);
export const SplatrArtist = model('Artist', SplatrArtistSchema);

// Frontend config
import ejs from "ejs";
export const viewsRoot = views_root;
App.use('/static/*', serveStatic({root:'./', onNotFound:(p, _c)=> console.log(p)}));

// Shared Middleware
App.use('*', setLocalVars);

// ROUTES
App.get('/', async (c) => {
  try {
    const page = await ejs.renderFile(`${viewsRoot}/index.ejs`, {user:c.var.user ?? undefined, path:c.var.path});
    return c.html(page, 200);
  } catch(e){
    throw e;
  }
});

App.get('/login', (c) =>{
  return c.redirect(OidcRedirect);
});

App.get('/oidc-callback', async (c)=>{
  try {
    const { code } = c.req.query(),
      tokenRequest = await fetch(new URL(token_endpoint), {
        method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: oidc.client_id,
            client_secret: oidc.client_secret,
            redirect_uri: oidc.redirect_uri,
            code
          })
      }),
      tokenResponse = await tokenRequest.json();

    if(!tokenRequest.ok) throw tokenResponse;

    const { payload:{sub, email, picture} } = await jwtVerify(tokenResponse.id_token, new TextEncoder().encode(oidc.client_secret), { issuer:`${oidc.iss}/`, audience:oidc.client_id });

    // Check for user and return target user
    const requestUrl = new URL(`${api.base_uri}/users?externalId=${sub}`);

    const existingUserRequest = await fetch(requestUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }),
          existingUserResponse = await existingUserRequest.json();

    if(!existingUserRequest.ok) throw existingUserResponse;

    const user:ISplatrUser = (existingUserResponse.data[0]) ? existingUserResponse.data[0] : await SplatrUser.create({ externalId:<string>sub, email:<string>email, profile:<string>picture });

    deleteCookie(c, 'splatr_sid');
    await setSignedCookie(c, 'splatr_sid', user._id.toString(), signing_key);

    if(user.artist) return c.redirect('/console');
    
    return c.redirect('/');

  } catch(e){
    throw e;
  }
});

App.get('/logout', (c)=>{
  try{
    deleteCookie(c, 'splatr_sid');
    return c.redirect('/');
  } catch(e){
    console.dir(e);
    throw e;
  }
});

import { Api as ApiRoutes } from "./routers/api/index.ts";
import { Console as ConsoleRoutes } from './routers/console/index.ts';

App.route('/api', ApiRoutes);

App.route('/console', ConsoleRoutes);

App.onError((err, c) => { console.dir(err); return c.text(err.message, 500) });

App.notFound(c => {console.dir(c.req.path); return c.text('404 NOT FOUND', 404)});