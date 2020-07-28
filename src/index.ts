import * as dotenv from 'dotenv'
import express from 'express'

import { UserRoutes } from './routes/user_routes'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use('/users', UserRoutes)
app.get('/*', (req, res) => res.json({ message: 'Hello dlroW' })) // Catch unhandled routes

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
