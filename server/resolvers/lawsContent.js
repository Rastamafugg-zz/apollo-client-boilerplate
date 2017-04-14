import axios from 'axios';
import xmlParser from 'xml2js';

import { BCLAWS_URL } from '../config';

export default function(obj, args, context, info) {
  return new Promise((resolve, reject) => {
    axios.get(BCLAWS_URL).then(function(result) {
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
};
