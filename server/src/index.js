import app from "./app";

app.listen({ port: 8000 }, () => {
  console.log(`Running in ${process.env.NODE_ENV} mode`);
  console.log("Apollo Server on http://localhost:8000/graphql");
});
