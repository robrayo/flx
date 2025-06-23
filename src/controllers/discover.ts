import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const discover = async (req: Request, res: Response) => {
  try {
    const { type } = req.params
    const query = req.query

    const searchParams = new URLSearchParams();
    const queries = Object.entries(query)
    queries.forEach(([key, value]) => {
      searchParams.append(key, value as string);
    })
    const queryString = searchParams.toString();

    const response = await client.get(`/api/tmdb/discover/${type}?${queryString}`, {
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