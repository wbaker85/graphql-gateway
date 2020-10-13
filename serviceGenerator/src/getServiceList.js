import axios from 'axios';
import { introspectSchema } from '@graphql-tools/wrap';
import { fetch } from 'cross-fetch';
import { printSchema, print } from 'graphql';

const config = {
  url: 'http:/v1.40/containers/json',
  socketPath: '/var/run/docker.sock',
};

const makeExecutor = (url) => {
  return async ({ document, variables }) => {
    const query = print(document);
    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };
};

const getEndpoints = async () => {
  const response = await axios.get(config.url, config);

  const endpoints = response.data.flatMap((container) => {
    if (container.Ports.some((portObj) => portObj.PublicPort !== undefined)) {
      return {
        name: container.Names[0],
        port: container.Ports[0].PublicPort,
      };
    } else {
      return [];
    }
  });

  let healthChecks = endpoints.map(async (serv) => {
    return await axios
      .get(`http://localhost:${serv.port}/.well-known/apollo/server-health`)
      .catch(() => false);
  });

  healthChecks = await Promise.all(healthChecks);

  healthChecks = healthChecks.map((res) => {
    if (res.data && res.data.status === 'pass') {
      return true;
    } else {
      return false;
    }
  });

  const graphEndpoints = endpoints.filter((_, idx) => {
    return healthChecks[idx];
  });

  return graphEndpoints;
};

const getNonExecutableSchema = async (url) => {
  const schema = await introspectSchema(makeExecutor(url));
  const schemaString = printSchema(schema);

  return schemaString;
};

export default async () => {
  const endpoints = await getEndpoints();

  return await Promise.all(
    endpoints.map(async (endpoint) => {
      return {
        name: endpoint.name,
        url: `http://localhost:${endpoint.port}`,
        nonExecutableSchema: await getNonExecutableSchema(
          `http://localhost:${endpoint.port}`
        ),
      };
    })
  );
};
