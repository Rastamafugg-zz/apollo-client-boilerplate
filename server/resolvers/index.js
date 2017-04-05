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
      const {path} = args;
      let url = "http://www.bclaws.ca/civix/content/complete/";
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
    },
    lawsDocument(obj, args, context, info) {
      const {path} = args;
      let tocUrl = "http://www.bclaws.ca/civix/content/complete/";
      if (path && Array.isArray(path)) {
        for (let pathItem of path) {
          tocUrl += pathItem + "/";
        }
      } else if (path) {
        console.error(`Given path parameter is not an array: ${path}`);
      }
      return new Promise((resolve, reject) => {
        axios.get(tocUrl).then(function(result) {
          //console.log(result.data);
          let parseString = xmlParser.parseString;
          parseString(result.data, function (err, resultJson) {
            let content = [];
            if (resultJson.root.document && Array.isArray(resultJson.root.document)) {
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
            let contentType = path[0];
            let pageUrls = [];
            for (let page of content) {
              if (!page.id.toString().endsWith('_00') && !page.id.toString().endsWith('_00_multi')) {
                pageUrls.push(axios.get(`http://www.bclaws.ca/civix/document/id/complete/${contentType}/${page.id}/xml`));
              }
            }

            let act = {
              parts: []
            };
            axios.all(pageUrls).then(function(result) {
              // console.log(result[0]);
              result.map(val => {
                parseString(val.data, function (err, resultJson) {

                  let actDoc = resultJson['act:act'];
                  let contentDoc = actDoc['act:content'][0];
                  if (!act.id) {
                    act.id = actDoc['$']['id'];
                    act.title = actDoc['act:title'][0];
                    act.chapter = actDoc['act:chapter'][0];
                    act.yearEnacted = actDoc['act:yearenacted'][0];
                    act.assentedTo = actDoc['act:assentedto'][0];
                  }
                  if (contentDoc['bcl:part']) {
                    let partDoc = contentDoc['bcl:part'][0];
                    let sectionsDoc = partDoc['bcl:section'];
                    let part = {
                      id: partDoc['$']['id'],
                      postfix: contentDoc['$']['postfix'],
                      num: partDoc['bcl:num'][0],
                      text: partDoc['bcl:text'][0],
                    };
                    if (sectionsDoc) {
                      part.sections = [];
                      for (let sectionDoc of sectionsDoc) {
                        let section = {
                          id: sectionDoc['$']['id'],
                          marginalNote: sectionDoc['bcl:marginalnote'][0],
                          num: sectionDoc['bcl:num'][0],
                        };
                        let subsectionsDoc = sectionDoc['bcl:subsection'];
                        if (subsectionsDoc) {
                          section.subsections = [];
                          for (let subsectionDoc of subsectionsDoc) {
                            let subsection = {
                              id: subsectionDoc['$']['id'],
                              text: subsectionDoc['bcl:text'][0],
                              num: subsectionDoc['bcl:num'][0],
                            };
                            section.subsections.push(subsection);
                          }
                          // console.log(sectionsDoc[0])
                        }
                        console.log(section)
                        part.sections.push(section);
                      }
                      // console.log(sectionsDoc[0])
                    }
                    /*
                     <act:content postfix="Part 1" id="98043_01">
                     <bcl:part id="d2e25">
                     <bcl:num>1</bcl:num>
                     <bcl:text>Definitions and Interpretation</bcl:text>
                     <bcl:section id="d2e34">
                     <bcl:marginalnote>Definitions and interpretation</bcl:marginalnote>
                     <bcl:num>1</bcl:num>
                     <bcl:subsection id="d2e42">
                     <bcl:num>1</bcl:num>
                     <bcl:text>In this Act:</bcl:text>
                     <bcl:definition id="d2e635">
                     <bcl:text>
                     <in:term>3/4 vote</in:term>
                     means a vote in favour of a resolution by at least 3/4 of the votes cast by eligible voters who are present in person or by proxy at the time the vote is taken and who have not abstained from voting;
                     </bcl:text>
                     </bcl:definition>
                     */
                    act.parts.push(part);
                  }
                  if (contentDoc['bcl:schedule']) {
                    let scheduleDoc = contentDoc['bcl:schedule'];
                    console.log(scheduleDoc)
                    // let partDoc = contentDoc['bcl:part'][0];
                    // let sectionsDoc = partDoc['bcl:section'];
                    // let part = {
                    //   id: partDoc['$']['id'],
                    //   postfix: contentDoc['$']['postfix'],
                    //   num: partDoc['bcl:num'],
                    //   text: partDoc['bcl:text'],
                    // };
                  }
                });
              });
              console.log(act)
              resolve(content);
            });
            // console.log(resultJson);
            // console.log(content);
          });
        }).catch(function(error) {
          console.log(error)
        });
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