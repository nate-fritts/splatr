export type { Artist } from "@/resources/artist.ts";
export type { ArtistOffer } from "@/resources/artistOffer.ts";

export {
  generateArtistQuery,
  isArtistDisplayName,
  isPopulated,
  isEmail,
  isUrl
} from "./utils/index.ts";