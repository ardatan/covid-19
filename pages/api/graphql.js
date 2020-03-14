import { ApolloServer, gql } from "apollo-server-micro";
import { find, sumBy } from "lodash";
import Covid19API from "./datasources/covid-19";

const typeDefs = gql`
  scalar Date

  type Count {
    confirmed: Int
    recovered: Int
    deaths: Int
  }

  type Daily {
    reportDate: Date
    mainlandChina: Int
    otherLocations: Int
    totalConfirmed: Int
    totalRecovered: Int
    reportDateString: String
    deltaConfirmed: Int
    deltaRecovered: Int
    objectid: Int
  }

  type Case {
    provinceState: String
    countryRegion: String
    lastUpdate: Date
    lat: Float
    long: Float
    confirmed: Int
    recovered: Int
    deaths: Int
    active: Int
    admin2: Int
    fips: Int
    combinedKey: Int
    iso2: String
    iso3: String
  }

  type Query {
    cases: [Case]
    case(countryRegion: String): Case
    daily: [Daily]
    count: Count
  }
`;

const resolvers = {
  Query: {
    cases: (_, args, { dataSources }) => {
      return dataSources.covid19API.getAllCases();
    },
    case: async (_, args, { dataSources }) => {
      return find(await dataSources.covid19API.getAllCases(), {
        countryRegion: args.countryRegion
      });
    },
    daily: (_, args, { dataSources }) => {
      return dataSources.covid19API.getDaily();
    },
    count: async (_, args, { dataSources }) => {
      return dataSources.covid19API.getCount();
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
