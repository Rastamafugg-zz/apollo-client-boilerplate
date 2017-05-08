import axios from 'axios';
import xamel from 'xamel';
import {BCLAWS_URL} from '../config';

export default function (obj, args, context, info) {
  const {path} = args;
  let url = BCLAWS_URL;
  if (path && Array.isArray(path)) {
    for (let pathItem of path) {
      url += "/" + pathItem;
    }
  } else if (path) {
    console.error(`Given path parameter is not an array: ${path}`);
  }
  // console.log(url);
  return new Promise((resolve, reject) => {
    axios.get(url).then(function (result) {
      // console.log(result.data);
      xamel.parse(result.data, function (err, xml) {
        console.log(JSON.stringify(xml));
        let documents = xml.$('root/dir');
        let content = [];
        if (documents) {
          for (let x = 0; x < documents.length; x++) {
            let document = documents.eq(x);
            // console.log(JSON.stringify(document));
            content.push({
              title: document.$('CIVIX_DOCUMENT_TITLE/text()'),
              location: document.$('CIVIX_DOCUMENT_LOC/text()'),
              id: document.$('CIVIX_DOCUMENT_ID/text()'),
              type: document.$('CIVIX_DOCUMENT_TYPE/text()'),
              parent: document.$('CIVIX_DOCUMENT_PARENT/text()'),
              ancestors: document.$('CIVIX_DOCUMENT_ANCESTORS/text()').toString().split(' '),
              isVisible: document.$('CIVIX_DOCUMENT_VISIBLE/text()'),
              order: parseInt(document.$('CIVIX_DOCUMENT_ORDER/text()'))
            })
          }
        } else {
          reject("No Documents found at URL: " + url);
        }
        content.sort((a, b) => a.order - b.order);
        resolve(content);
      });
    }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    });
};