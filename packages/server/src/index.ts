import { readFileSync } from 'fs';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pathToFileURL } from 'url';
import { resolvers } from './resolvers';

const typeDefs = readFileSync(pathToFileURL('../shared/src/schema.graphql'), 'utf-8');

const app = express();
const PORT = process.env.PORT || 4000;

const ALLOWED_HOSTS = ['http://localhost:5173'];

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors({
    origin: ALLOWED_HOSTS,
    credentials: true,
  }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => ({ req }),
  }));

  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
    console.log(`Accepting requests from: ${ALLOWED_HOSTS.join(', ')}`);
  });
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});
