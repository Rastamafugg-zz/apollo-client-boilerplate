import { MongoClient } from 'mongodb';

import { GOVERNMENT_URL } from '../config';

export default function(obj, args, context, info) {
  const {collectionName, propertyName} = args;
  if (!collectionName || !propertyName) return [];
  console.log(`propertyValues(collectionName: ${collectionName} propertyName: ${propertyName})`);
  return new Promise((resolve, reject) => {
    MongoClient.connect(GOVERNMENT_URL).then(db => {
      let result = [];
      let cursor = db.collection(collectionName).distinct(propertyName, {}, (err, items) => {
        resolve(items.sort().map(item => {return {name: item, value: item}}));
      });
    }).catch(err => {
      console.log(`error: ${err}`);
    });
  });
};
