import app from "./app";
import { sequelize } from "./lib/sequelize";

(async function(sequelize, app) {
  await sequelize.sync();
  app.get("/", (request, response) => response.send("sup."));
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
})(sequelize, app);
