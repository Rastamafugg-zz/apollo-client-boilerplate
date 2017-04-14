import axios from 'axios';
import xmlParser from 'xml2js';

import { BCLAWS_URL } from '../config';

export default function(obj, args, context, info) {
  const {path} = args;
  let url = BCLAWS_URL;
  if (path && Array.isArray(path)) {
    for (let pathItem of path) {
      url += pathItem + "/";
    }
  } else if (path) {
    console.error(`Given path parameter is not an array: ${path}`);
  }
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(result) {
      //console.log(result.data);
      let parseString = xmlParser.parseString;
      parseString(result.data, function (err, resultJson) {
        let content = [];
        if (resultJson.root.index && Array.isArray(resultJson.root.index)) {
          for (let document of resultJson.root.index) {
            content.push({
              title: document.CIVIX_DOCUMENT_TITLE,
              id: document.CIVIX_DOCUMENT_ID
            })
          }
        } else if (resultJson.root.dir && Array.isArray(resultJson.root.dir)) {
          for (let document of resultJson.root.dir) {
            content.push({
              title: document.CIVIX_DOCUMENT_TITLE,
              id: document.CIVIX_DOCUMENT_ID,
              type: document.CIVIX_DOCUMENT_TYPE,
              parent: document.CIVIX_DOCUMENT_PARENT,
              ancestors: document.CIVIX_DOCUMENT_ANCESTORS.toString().split(','),
              isVisible: document.CIVIX_DOCUMENT_VISIBLE,
              order: parseInt(document.CIVIX_DOCUMENT_ORDER)
            })
          }
        } else if (resultJson.root.document && Array.isArray(resultJson.root.document)) {
          for (let document of resultJson.root.document) {
            content.push({
              title: document.CIVIX_DOCUMENT_TITLE,
              location: document.CIVIX_DOCUMENT_LOC,
              id: document.CIVIX_DOCUMENT_ID,
              type: document.CIVIX_DOCUMENT_TYPE,
              parent: document.CIVIX_DOCUMENT_PARENT,
              ancestors: document.CIVIX_DOCUMENT_ANCESTORS.toString().split(','),
              isVisible: document.CIVIX_DOCUMENT_VISIBLE,
              order: parseInt(document.CIVIX_DOCUMENT_ORDER)
            })
          }
        }
        content.sort((a, b) => a.order - b.order);
        console.log(resultJson);
        console.log(content);
        resolve(content);
      });
    }).catch(function(error) {
      console.log(error)
    });
  });
};
