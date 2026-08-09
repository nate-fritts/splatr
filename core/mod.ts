export {
  SArtist
} from "./schemas.ts";

export type {
  IArtist,
  ReferencedDoc
} from "./types.ts";

export {
  generateArtistQuery,
  isArtistDisplayName,
  isPopulated,
  isEmail,
  isUrl
} from "./utils/index.ts";