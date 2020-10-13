import getServiceList from './getServiceList';

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'gateway';
const collectionName = 'services';

const establishCollection = async () => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return collection;
};

const addOneDocument = async (dataJSON) => {
  const collection = await establishCollection();
  const result = await collection.insertOne(dataJSON);
  return result.insertedId;
};

const updateServices = async () => {
  const serviceList = await getServiceList();
  console.log('Update in progress - ' + Date());
  await addOneDocument({ serviceList });
};

updateServices();
setInterval(updateServices, 10000);
