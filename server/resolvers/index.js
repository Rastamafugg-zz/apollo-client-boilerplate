import axios from 'axios';
import xmlParser from 'xml2js';

const MongoClient = require('mongodb').MongoClient;
const strataUrl = 'mongodb://127.0.0.1/strata';
const governmentUrl = 'mongodb://127.0.0.1/government';
/*
 {laws {
 title,
 documentId
 }}
 */
export default {
  Query: {
    bylaws(obj, args, context, info) {
      return new Promise((resolve, reject) => {
        MongoClient.connect(strataUrl).then(db => {
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
    },
    lawsContent(obj, args, context, info) {
      return new Promise((resolve, reject) => {
        axios.get('http://www.bclaws.ca/civix/content/complete').then(function(result) {
          //console.log(result.data);
          let parseString = xmlParser.parseString;
          parseString(result.data, function (err, resultJson) {
            let content = [];
            for (let document of resultJson.root.index) {
              content.push({
                title: document.CIVIX_DOCUMENT_TITLE,
                documentId: document.CIVIX_DOCUMENT_ID
              })
            }
            resolve(content);
          });
        }).catch(function(error) {
          console.log(error)
        });
      });
    },
    lawsDocumentList(obj, args, context, info) {
      const {contentType, sectionType} = args;
      let url = (sectionType)
          ? `http://www.bclaws.ca/civix/content/complete/${contentType}/${sectionType}`
          : `http://www.bclaws.ca/civix/content/complete/${contentType}`;
      return new Promise((resolve, reject) => {
        axios.get(url).then(function(result) {
          //console.log(result.data);
          let parseString = xmlParser.parseString;
          parseString(result.data, function (err, resultJson) {
            let content = [];
            for (let document of resultJson.root.dir) {
              content.push({
                title: document.CIVIX_DOCUMENT_TITLE,
                documentId: document.CIVIX_DOCUMENT_ID,
                documentType: document.CIVIX_DOCUMENT_TYPE,
                documentParent: document.CIVIX_DOCUMENT_PARENT,
                documentAncestors: [document.CIVIX_DOCUMENT_ANCESTORS],
                documentVisible: document.CIVIX_DOCUMENT_VISIBLE,
                documentOrder: parseInt(document.CIVIX_DOCUMENT_ORDER)
              })
            }
            content.sort((a, b) => a.documentOrder - b.documentOrder);
            console.log(resultJson);
            console.log(content);
            resolve(content);
          });
        }).catch(function(error) {
          console.log(error)
        });

        // axios.get('http://www.bclaws.ca/civix/document/id/complete/statreg/98043_00').then(function(result) {
        //   console.log(result.data)
        //   // var parseString = xmlParser.parseString;
        //   // parseString(result.data, function (err, resultJson) {
        //   //     console.log(resultJson);
        //   // });}).catch(function(error) {
        //   // console.log(error)
        // })
      });
    },
    taxes(obj, args, context, info) {
      const {regionalDistrict, municipality, year} = args;

      return new Promise((resolve, reject) => {
        MongoClient.connect(governmentUrl).then(db => {
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
    },
    propertyValues(obj, args, context, info) {
      const {collectionName, propertyName} = args;
      if (!collectionName || !propertyName) return [];
      console.log(`propertyValues(collectionName: ${collectionName} propertyName: ${propertyName})`);
      return new Promise((resolve, reject) => {
        MongoClient.connect(governmentUrl).then(db => {
          let result = [];
          let cursor = db.collection(collectionName).distinct(propertyName, {}, (err, items) => {
            resolve(items.sort().map(item => {return {name: item, value: item}}));
          });
        }).catch(err => {
          console.log(`error: ${err}`);
        });
      });
    }
  }
}