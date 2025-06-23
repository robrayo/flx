import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import FlixerRouter from './routes'

config();

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))

app.use('/', FlixerRouter)

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000')
})