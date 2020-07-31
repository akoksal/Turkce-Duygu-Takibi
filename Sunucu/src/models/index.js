import Sequelize from 'sequelize';
import Operation from './operation';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  }
);

// dont force to not drop the tables
sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  });

const models = {
  Operation: Operation(sequelize, Sequelize)
};

export default models;