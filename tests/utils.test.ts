import { assertEquals } from "@std/assert";
import { isArtistDisplayName } from "../utils/index.ts";
import { randomBytes } from 'node:crypto';

Deno.test({
  name: 'isArtistDisplayName',
  fn: async (t) => {
    await t.step({
      name: 'Success',
      fn: () => {
        assertEquals(isArtistDisplayName(`b-_${randomBytes(14).toString('hex')}`), true);
      }
    });

    await t.step({
      name: 'Failures',
      fn: async (t) => {
        await t.step({
          name: 'too short',
          fn: () => {
            assertEquals(isArtistDisplayName('a'), false);
          }
        });

        await t.step({
          name: 'too long',
          fn: () => {
            assertEquals(isArtistDisplayName(`b${randomBytes(16).toString('hex')}`), false);
          }
        });
        
        await t.step({
          name: 'invalid start character',
          fn: () => {
            assertEquals(isArtistDisplayName(`2${randomBytes(15).toString('hex')}`), false);
          }
        });

        await t.step({
          name: 'invalid characters',
          fn: () => {
            assertEquals(isArtistDisplayName(`splatr@art`), false);
          }
        });
      }
    })
  }
});