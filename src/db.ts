import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'peekr',
  process.env.DB_USER || 'postgres',
  process.env.DB_PWD,
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  }
)

export const initDB = async (): Promise<Sequelize> =>
  await sequelize.sync({ force: true })
