import express, { Request, Response } from 'express'
import * as UserService from '../services/user_service'
import { User } from '../models/user'

const router = express.Router()

// GET users/
router.get('/', async (req: Request, res: Response) => {
  try {
    const users: Array<User> = await UserService.findAll()

    res.status(200).send(users)
  } catch (e) {
    res.status(404).send(e.message)
  }
})

// GET users/:id
router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10)

  try {
    const user: User = await UserService.find(id)

    res.status(200).send(user)
  } catch (e) {
    res.status(404).send(e.message)
  }
})

// POST users/
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log(req.body)

    const user: User = {
      id: parseInt(req.body.id),
      email: req.body.email,
      favs: req.body.favs,
    }

    await UserService.create(user)

    res.sendStatus(201)
  } catch (e) {
    res.status(404).send(e.message)
  }
})

// PUT users/
router.put('/', async (req: Request, res: Response) => {
  try {
    const user: User = {
      id: parseInt(req.body.id),
      email: req.body.email,
      favs: req.body.favs,
    }

    await UserService.update(user)

    res.sendStatus(200)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

// DELETE users/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10)
    await UserService.remove(id)

    res.sendStatus(200)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

export const UserRoutes = router
