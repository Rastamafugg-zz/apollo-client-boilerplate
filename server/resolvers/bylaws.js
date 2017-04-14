import { MongoClient } from 'mongodb';

import { STRATA_URL } from '../config';

export default function(obj, args, context, info) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(STRATA_URL).then(db => {
      let result = [];
      let cursor = db.collection('bylaws').find();
      cursor.each(function(err, doc) {
        if (doc != null) {
          console.log(doc);
          result.push(doc);
        } else {
          console.log("Closing");
          db.close();
          console.log(`result: ${result}`);
          resolve(result);
        }
      });
    }).catch(err => {
      console.log(`error: ${err}`);
    });
  });
};
