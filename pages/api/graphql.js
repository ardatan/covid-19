import { ApolloServer, gql } from "apollo-server-micro";
import Covid19API from "./datasources/covid-19";

const typeDefs = gql`
  scalar Date
  type Case {
    provinceState: String
    countryRegion: String
    lastUpdate: Date
    lat: Float
    long: Float
    confirmed: Int
    deaths: Int
    recovered: Int
  }

  type Query {
    cases: [Case]
  }
`;

const resolvers = {
  Query: {
    cases: (_, __, { dataSources }) => {
      return dataSources.covid19API.getAllCases();
    }
  }
};

export const config = {
  api: {
    bodyParser: false
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    covid19API: new Covid19API()
  }),
  introspection: true,
  playground: true
});

export default apolloServer.createHandler({ path: "/api/graphql" });
