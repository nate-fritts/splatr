export { ACCESS_SCOPE_ACTIONS, ARRAY_MODES } from "@/data.ts";

export type { Artist, DArtist, CreateArtistRequest, UpdateArtistRequest } from "@/resources/artist.ts";
export { SArtist } from "@/resources/artist.ts";

export type { ArtistOffer } from "@/resources/artistOffer.ts";
export { SArtistOffer } from "@/resources/artistOffer.ts";

export type {
  ArrayMode,
  ApiResponse,
  ApiDataResponse,
  ApiErrorResponse,
  TimestampedDocument
} from "@/types.ts";

export {
  generateArtistQuery,
  isArtistDisplayName,
  isPopulated,
  isEmail,
  isUrl
} from "@/utils/index.ts";