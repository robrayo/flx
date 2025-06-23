import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const trending = async (req: Request, res: Response) => {
  try {
    const { type, range } = req.params
    const { page = 1 } = req.query

    const response = await client.get(`/api/tmdb/trending/${type}/${range}?page=${page}`, {
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