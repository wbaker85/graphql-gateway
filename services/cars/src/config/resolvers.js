import * as apiClient from '../api/apiClient';

const resolvers = {
  Query: {
    allCars: () => {
      console.log('hello');
      return apiClient.getAllCars();
    },
  },
  Mutation: {
    createCar: (root, args) => apiClient.createCar(args),
  },
  Car: {
    __resolveReference: (ref) => {
      console.log(apiClient.findCarById(+ref.id));
      return apiClient.findCarById(+ref.id);
    },
  },
};

export default resolvers;
