import * as dotenv from 'dotenv'
import express, { Request, Response, NextFunction } from 'express'

import { UserRoutes } from './routes/user_routes'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/users', UserRoutes)

app.use((req: Request, res: Response, next: NextFunction) =>
  res.status(404).json({ message: 'nothing here' })
) // Catch unhandled routes

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack)
  res.status(500).json({ message: 'Something broke!' })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
