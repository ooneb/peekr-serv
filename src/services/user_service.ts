import { User, users } from '../models/user'

export const findAll = async (): Promise<Array<User>> => {
  return users
}

export const find = async (id: number): Promise<User> => {
  return users[id]
}

export const create = async (newUser: User): Promise<void> => {
  users.push(newUser)
}

export const update = async (updatedUser: User): Promise<void> => {
  const user: User = users[updatedUser.id]
  user.email = updatedUser.email
  user.favs = updatedUser.favs
}

export const remove = async (id: number): Promise<void> => {
  const record: User = users[id]

  if (record) {
    delete users[id]
    return
  }

  throw new Error('No record found to delete')
}
