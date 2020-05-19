import app from "./app";
import { sequelize } from "./lib/sequelize";

(async function (sequelize, app) {
  await sequelize.sync();
  app.get("/", (request, response) => response.send("retro"));
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Apollo Server is running on port ${PORT}`);
  });
})(sequelize, app);
