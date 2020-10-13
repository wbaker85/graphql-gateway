import { ApolloServer } from 'apollo-server';
import getServiceList from './getServiceList';
import getSchema from './getSchema';

(async () => {
  const serviceList = await getServiceList();
  console.log(serviceList);
  const schema = getSchema(serviceList);

  const server = new ApolloServer({ schema });

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
})();
