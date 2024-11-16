require('dotenv').config();
module.exports = {
    development: {
      username: process.env.DB_USER || "your_postgres_username",
      password: process.env.DB_PASS || "your_postgres_password",
      database: process.env.DB_NAME || "your_database_name",
      host: process.env.DB_HOST || "127.0.0.1",
      dialect: "postgres"
    }
  };