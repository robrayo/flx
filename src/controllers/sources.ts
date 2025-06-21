import { Request, Response } from "express"
import { Flixer } from "../extractors/flixer";
import axios from "axios";

export const sources = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params
    const { season, episode } = req.query

    if (!type || !id) {
      res.status(400).json({ message: "Missing type or id" })
      return
    }

    let sources = null;

    switch (type) {
      case "movie":
        const movieSources = await new Flixer().getMovieSources(id);
        /*  console.log("Movie sources:", movieSources); */
        sources = movieSources
        break

      case "tv":
        if (!season || !episode) {
          res.status(400).json({ message: "Missing seasons or episodes" })
          return
        }
        const tvSources = await new Flixer().getTVSources(id, season.toString(), episode.toString());
        /*  console.log("Movie sources:", tvSources); */
        sources = tvSources
        break
    }

    const response = await axios.get('https://sub.wyzie.ru/search?id=278&format=srt');
    const subtitles = response.data || []

    res.status(200).json({ ...sources, subtitles })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

