import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db'

export interface User {
  id?: number
  email: string
  favs: string
}

export class UserModel extends Model {
  public id!: number
  public email!: string
  public favs?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
    favs: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize: sequelize, // this bit is important
  }
)
