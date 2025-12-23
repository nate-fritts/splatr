import { Hono } from "@hono";
import * as jose from "@panva/jose";
const {} = jose;
export const Api = new Hono();
import { addResponseMetadata } from '../../middleware/logging.ts';

import { Users as UserRoutes } from "./users.ts";

Api.use('*', addResponseMetadata);
Api.route('/users', UserRoutes);