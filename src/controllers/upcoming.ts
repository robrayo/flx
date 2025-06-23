import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const upcoming = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const {
      page = 1,
      vote_count_gte = 50
    } = req.query

    const response = await client.get(`/api/tmdb/${type}/upcoming?page=${page}&vote_count_gte=${vote_count_gte}`, {
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