import { MongoClient } from 'mongodb';

import { GOVERNMENT_URL } from '../config';

export default function(obj, args, context, info) {
  const {regionalDistrict, municipality, year} = args;

  return new Promise((resolve, reject) => {
    MongoClient.connect(GOVERNMENT_URL).then(db => {
      let result = [];
      let filter = {};
      if (regionalDistrict) {
        filter.regionalDistrict = regionalDistrict;
      }
      if (municipality) {
        filter.municipality = municipality;
      }
      if (year) {
        filter.year = year;
      }
      console.log(`Filter: ${JSON.stringify(filter)}`);

      let cursor = db.collection('taxes').find(filter);
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
