import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../db'

export interface BlogList {
  id?: number
  name: string
}

export class BlogListModel extends Model implements BlogList {
  public id!: number
  public name!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

BlogListModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(256),
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: 'blog_lists',
    sequelize: sequelize, // this bit is important
  }
)
