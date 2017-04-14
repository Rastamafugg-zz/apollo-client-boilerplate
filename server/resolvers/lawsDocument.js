import axios from 'axios';
import xmlParser from 'xml2js';

import { BCLAWS_URL, BCLAWS_DOC_URL } from '../config';

function parseDivision(divisionDoc) {
  let division = {
    id: divisionDoc['$']['id'],
    text: divisionDoc['bcl:text'][0],
    num: divisionDoc['bcl:num'][0],
  };
  let sectionsDoc = divisionDoc['bcl:section'];
  if (sectionsDoc) {
    division.sections = [];
    for (let sectionDoc of sectionsDoc) {
      division.sections.push(parseSection(sectionDoc));
    }
  }
  return division;
}

function parseSection(sectionDoc) {
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
  // console.log(section);
  return section;
}

export default function(obj, args, context, info) {
  const {path} = args;
  let tocUrl = BCLAWS_URL;
  if (path && Array.isArray(path)) {
    for (let pathItem of path) {
      tocUrl += "/" + pathItem;
    }
  } else if (path) {
    console.error(`Given path parameter is not an array: ${path}`);
  }
  console.log(tocUrl);
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
            pageUrls.push(axios.get(BCLAWS_DOC_URL(contentType, page.id)));
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
              if (act.id === undefined) {
                act.id = actDoc['$']['id'];
                act.title = actDoc['act:title'][0];
                act.chapter = actDoc['act:chapter'][0];
                act.yearEnacted = actDoc['act:yearenacted'][0];
                act.assentedTo = actDoc['act:assentedto'][0];

                console.log(`id: ${act.id}, title: ${act.title}, chapter: ${act.chapter}, yearEnacted: ${act.yearEnacted}, assentedTo: ${act.assentedTo}`);
              }
              if (contentDoc['bcl:part']) {
                let partDoc = contentDoc['bcl:part'][0];
                let sectionsDoc = partDoc['bcl:section'];
                let divisionsDoc = partDoc['bcl:division'];
                let part = {
                  id: partDoc['$']['id'],
                  postfix: contentDoc['$']['postfix'],
                  num: partDoc['bcl:num'][0],
                  text: partDoc['bcl:text'][0],
                };
                if (divisionsDoc) {
                  part.content = [];
                  for (let divisionDoc of divisionsDoc) {
                    part.content.push(parseDivision(divisionDoc));
                  }
                }
                if (sectionsDoc) {
                  part.content = [];
                  for (let sectionDoc of sectionsDoc) {
                    part.content.push(parseSection(sectionDoc));
                  }
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
          resolve(act);
        });
        // console.log(resultJson);
        // console.log(content);
      });
    }).catch(function(error) {
      console.log(error)
    });
  });
};
