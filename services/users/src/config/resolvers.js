import * as apiClient from '../api/apiClient';

const resolvers = {
  Query: {
    allUsers: () => apiClient.getAllUsers(),
  },
  Mutation: {
    createUser: (root, args) => apiClient.createUser(args),
  },
  User: {
    cars: (user) => {
      const mapped = user.cars.map((id) => {
        return { __typename: 'Car', id };
      });

      console.log(mapped);

      return mapped;
    },
  },
};

export default resolvers;
