import { User, UserModel } from '../models/user'

export const findAll = async (): Promise<Array<User>> => {
  const users: Array<UserModel> = await UserModel.findAll<UserModel>()
  return users
}

export const find = async (id: number): Promise<User> => {
  const user: UserModel | null = await UserModel.findByPk<UserModel>(id)
  if (!user) throw new Error('User not found')

  return user
}

export const create = async (newUser: User): Promise<void> => {
  console.log({ ...newUser })

  await UserModel.create<UserModel>({ ...newUser })
}

export const update = async (updatedUser: User): Promise<void> => {
  const [nb]: [number, UserModel[]] = await UserModel.update(updatedUser, {
    where: { id: updatedUser.id },
    limit: 1,
  })

  if (nb <= 0) throw new Error('User not found')
}

export const remove = async (id: number): Promise<void> => {
  const nb: number = await UserModel.destroy({ where: { id: id } })
  if (nb <= 0) throw new Error('User not found')
}
