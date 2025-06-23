import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const newReleases = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const {
      page = 1,
      primary_release_date_gte = '2023-01-01',
      vote_count_gte = 200,
      vote_average_gte = 6.5,
      sort_by = "release_date.desc"
    } = req.query

    const response = await client.get(`/api/tmdb/discover/${type}?page=${page}&primary_release_date_gte=${primary_release_date_gte}&vote_count.gte=${vote_count_gte}&vote_average.gte=${vote_average_gte}&sort_by=${sort_by}`, {
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