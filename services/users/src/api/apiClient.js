import { v4 as uuidv4 } from 'uuid';

let users = [
  {
    id: uuidv4(),
    username: 'John Smith',
    cars: [1, 2],
  },
  {
    id: uuidv4(),
    username: 'Jane Doe',
    cars: [2],
  },
];

export const getAllUsers = async () => {
  return JSON.parse(JSON.stringify(users));
};

export const createUser = async (data) => {
  const newUser = { id: uuidv4(), ...data };
  users.push(newUser);
  return newUser;
};

export const findUserById = async (id) => {
  return users.filter((user) => user.id === id);
};
