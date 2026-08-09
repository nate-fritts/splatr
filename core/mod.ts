export {
  SArtist
} from "./schemas.ts";

export type {
  IArtist,
  IOffer,
  ReducedDoc,
  ReferencedDoc,
  TimestampedDocument
} from "./types.ts";

export {
  generateArtistQuery,
  isArtistDisplayName,
  isPopulated,
  isEmail,
  isUrl
} from "./utils/index.ts";