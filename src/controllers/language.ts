import { Request, Response } from "express";
import { client } from "../lib/client";
import { ACCEPT, ORIGIN, REFERER } from "../utils/constants";

export const language = async (req: Request, res: Response) => {
  try {
    const { lang } = req.params
    const { query, page = 1, limit = 50, type = "movie" } = req.query
    const hasQuery = query ? 'search' : 'content'

    const response = await client.get(`/api/content/language/${lang}/${hasQuery}?type=${type}&page=${page}&limit=${limit}&query=${query}`, {
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

export const languages = async (req: Request, res: Response) => {
  try {
    const response = await client.get(`/api/content/languages`, {
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