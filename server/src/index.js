import app from "./app";
import { sequelize } from "./lib/sequelize";

(async function(sequelize, app) {
  await sequelize.sync();
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
})(sequelize, app);
