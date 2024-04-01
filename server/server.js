const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

// Initial configuration
dotenv.config();
const app = express();

// Apollo Server setup for GraphQL
const server = new ApolloServer({ typeDefs, resolvers });

async function startApolloServer() {
  await server
    .start()
    .then(
      console.log(`🚀 Apollo Server ready at http://localhost:4000/graphql`)
    );

  app.use(
    "/graphql",
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // MongoDB connection
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "knolEcom",
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startApolloServer();
