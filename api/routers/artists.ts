import { setArtistVar } from "@/middleware.ts";
import { Hono } from "@hono";
export const ArtistRoutes = new Hono();

// ARTISTS
import { postArtist, getArtistById, deleteArtistById, patchArtistById, getArtistOfferById, postArtistOffer, patchArtistOfferById, deleteArtistOfferById } from "@/route_handlers/artists.ts";

ArtistRoutes.post('/', postArtist);

ArtistRoutes.use('/:artistId', setArtistVar);
ArtistRoutes.get('/:artistId', getArtistById);
ArtistRoutes.patch('/:artistId', patchArtistById);
ArtistRoutes.delete('/:artistId', deleteArtistById);

ArtistRoutes.post('/:artistId/offers', postArtistOffer);
ArtistRoutes.get('/:artistId/offers/:offerId', getArtistOfferById);
ArtistRoutes.patch('/:artistId/offers/:offerId', patchArtistOfferById);
ArtistRoutes.delete('/:artistId/offers/:offerId', deleteArtistOfferById);