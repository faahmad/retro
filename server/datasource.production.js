module.exports = {
  retro_prod: {
    host: `/cloudsql/${process.env.DATABASE_CONNECTION_NAME}`,
    database: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  }
};
