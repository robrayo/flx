import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const tvSeasonEpisodes = async (req: Request, res: Response) => {
  try {
    const { id, season } = req.params

    const response = await client.get(`/api/tmdb/tv/${id}/season/${season}`, {
      headers: {
        'Accept': ACCEPT,
        'Referer': REFERER,
        'Origin': ORIGIN
      }
    });
    const data = await response.data;

    res.status(200).json({ data })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}