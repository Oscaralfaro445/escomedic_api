const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: {
      timestamps: false, // Controlamos created_at/updated_at manualmente por columna
      freezeTableName: true, // Evita que Sequelize pluralice nombre de tabla
    },
  },
);

module.exports = sequelize;
