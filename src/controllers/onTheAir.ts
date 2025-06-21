import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const onTheAir = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      vote_count_gte = 100,
      vote_average_gte = 6,
      without_genres = '10763%2C10767'
    } = req.query

    const response = await client.get(`/api/tmdb/tv/on_the_air?page=${page}&vote_count.gte=${vote_count_gte}&vote_average.gte=${vote_average_gte}&without_genres=${without_genres}`, {
      headers: {
        'Accept': ACCEPT,
        'Referer': REFERER,
        'Origin': ORIGIN
      }
    });
    const data = await response.data;

    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}