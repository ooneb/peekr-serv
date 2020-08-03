import { User, users } from '../models/user'

export const findAll = async (): Promise<Array<User>> => {
  return users
}

export const find = async (id: number): Promise<User> => {
  const user: User | undefined = users.find((e: User) => e.id === id)
  if (!user) throw new Error('User not found')

  return user
}

export const create = async (newUser: User): Promise<void> => {
  users.push(newUser)
}

export const update = async (updatedUser: User): Promise<void> => {
  const user: User | undefined = users.find(
    (e: User) => e.id === updatedUser.id
  )
  if (!user) throw new Error('User not found')

  user.email = updatedUser.email
  user.favs = updatedUser.favs
}

export const remove = async (id: number): Promise<void> => {
  const userIdx: number = users.findIndex((e: User) => e.id === id)
  if (userIdx < 0) throw new Error('User not found')

  if (userIdx) {
    users.splice(userIdx, 1)
    return
  }
}
