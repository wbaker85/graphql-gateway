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

const getLatestDocument = async () => {
  const collection = await establishCollection();
  const result = await collection.findOne({}, { sort: { _id: -1 } });
  return result;
};

export default async () => {
  const latestServiceListEntry = await getLatestDocument();
  return latestServiceListEntry.serviceList;
};
