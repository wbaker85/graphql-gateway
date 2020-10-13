import { fetch } from 'cross-fetch';
import { print, buildSchema } from 'graphql';
import { wrapSchema } from '@graphql-tools/wrap';
import { mergeSchemas } from 'graphql-tools';

// const executor = async ({ document, variables }) => {
//   const query = print(document);
//   const fetchResult = await fetch('http://localhost:4002', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ query, variables }),
//   });
//   return fetchResult.json();
// };

export const makeExecutor = (url) => {
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

// export const executableSchemaFromUrls = (urlList) => {
//   const schemas = urlList.map((urlObj) => {
//     return wrapSchema({
//       schema: urlObj.schemaText,
//       executor: makeExecutor(urlObj.url),
//     });
//   });

//   return mergeSchemas({ schemas });
// };

export const executableSchemaFromServiceList = (serviceList) => {
  return serviceList.map((service) => {
    return {
      ...service,
      executableSchema: wrapSchema({
        schema: buildSchema(service.nonExecutableSchema),
        executor: makeExecutor(service.url),
      }),
    };
  });
};

export default (serviceList) => {
  const executableSchemaServiceList = executableSchemaFromServiceList(
    serviceList
  );

  const schemas = executableSchemaServiceList.map(
    (obj) => obj.executableSchema
  );
  return mergeSchemas({ schemas });
};
