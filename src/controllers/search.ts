import { Request, Response } from "express"
import { client } from "../lib/client"
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants"

export const search = async (req: Request, res: Response) => {
  try {
    const { query = 'one piece', page = 1 } = req.query

    const response = await client.get(`/api/tmdb/search/multi?query=${query}&page=${page}`, {
      headers: {
        'Accept': ACCEPT,
        'Referer': REFERER,
        'Origin': ORIGIN
      }
    })
    const data = response.data;

    res.status(200).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}