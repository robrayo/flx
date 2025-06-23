import { Router } from "express";
import { trending } from "../controllers/trending";
import { popular } from "../controllers/popular";
import { topRated } from "../controllers/topRated";
import { awardWorthy } from "../controllers/awardWorthy";
import { newReleases } from "../controllers/newReleases";
import { nowPlayingInTheaters } from "../controllers/nowPlayingInTheaters";
import { discover } from "../controllers/discover";
import { upcoming } from "../controllers/upcoming";
import { onTheAir } from "../controllers/onTheAir";
import { info } from "../controllers/info";
import { tvSeasonEpisodes } from "../controllers/tvSeasonEpisodes";
import { sources } from "../controllers/sources";
import { search } from "../controllers/search";
import { language, languages } from "../controllers/language";
import { m3u8Proxy } from "../controllers/m3u8Proxy";

const router = Router();

router.get('/m3u8-proxy', m3u8Proxy)

router.get('/search', search)

router.get('/trending/:type/:range', trending)

router.get('/popular-movies', popular)

router.get('/top-rated/:type', topRated)

router.get('/award-worthy/:type', awardWorthy)

router.get('/new-releases/:type', newReleases)

router.get('/now-playing-in-theaters/:type', nowPlayingInTheaters)

// default to --->  Action & Adventures Movies
router.get('/discover/:type', discover)

router.get('/upcoming/:type', upcoming)

router.get('/tv/on-the-air', onTheAir)

router.get('/languages', languages)

router.get('/language/:lang', language)

// Get movie info and tv info and seasons
router.get('/info/:type/:id', info)

// Get tv episodes
router.get('/tv-season-episodes/:id/:season', tvSeasonEpisodes)

router.get('/sources/:type/:id', sources)

export default router