import axios from "axios";
import { Request, Response } from "express"
import { LineTransform } from "../utils/lineTransform";

export const m3u8Proxy = async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    const isPlay = Boolean(req.query.play);
    if (!url) return res.status(400).json("url is required");

    if (isPlay) {
      const response = await axios.get(url, {
        responseType: 'stream',
      })
      const headers = { ...response.headers };
      delete headers['content-length']
      headers['access-control-allow-origin'] = '*';
      headers['access-control-allow-methods'] = '*';
      headers['access-control-allow-headers'] = '*';
      headers['access-control-allow-credentials'] = '*'
      res.set(headers);
      return response.data.pipe(res);
    }

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Accept: "*/*",
        Referer: "https://flixer.su/",
        Origin: "https://flixer.su",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    const headers = { ...response.headers };
    delete headers['content-length']
    headers['access-control-allow-origin'] = '*';
    headers['access-control-allow-methods'] = '*';
    headers['access-control-allow-headers'] = '*';
    headers['access-control-allow-credentials'] = '*'
    res.set(headers);

    if (isPlay) {
      return response.data.pipe(res);
    }

    const transform = new LineTransform();
    return response.data.pipe(transform).pipe(res);
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}