import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const info = async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params

    const response = await client.get(`/api/tmdb/${type}/${id}?append_to_response=videos`, {
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