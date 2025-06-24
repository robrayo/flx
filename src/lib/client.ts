import axios from "axios";
import { config } from "dotenv";

config()

export const client = axios.create({
  baseURL: process.env.SCRAPE_BASE_URL
})