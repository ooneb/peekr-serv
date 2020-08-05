import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db'

import { BlogListModel } from './blog_list'

export interface User {
  id?: number
  email: string
  favs?: string
}

export class UserModel extends Model implements User {
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

UserModel.hasMany(BlogListModel, { foreignKey: 'user_id', onDelete: 'CASCADE' })
// BlogListModel.belongsTo(UserModel)
