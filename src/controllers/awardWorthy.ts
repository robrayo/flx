import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const awardWorthy = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const {
      page = 1,
      vote_count_gte = 1000,
      vote_average_gte = 7.5,
      sort_by = "vote_count.desc"
    } = req.query

    const response = await client.get(`/api/tmdb/discover/${type}?page=${page}&vote_count.gte=${vote_count_gte}&vote_average.gte=${vote_average_gte}&sort_by=${sort_by}`, {
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