import axios from 'axios';
import xmlParser from 'xml2js';

import { BCLAWS_URL, BCLAWS_DOC_URL } from '../config';

function retrieveId(docNode) {
  return (docNode['$']) ? docNode['$']['id'] : null;
}

function retrieveValue(docNode, field) {
  return (docNode[field]) ? docNode[field][0] : null;
}

function parseDivision(divisionDoc) {
  let division = {
    id: retrieveId(divisionDoc),
    text: retrieveValue(divisionDoc, 'bcl:text'),
    num: retrieveValue(divisionDoc, 'bcl:num'),
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
    id: retrieveId(sectionDoc),
    marginalNote: retrieveValue(sectionDoc, 'bcl:marginalnote'),
    num: retrieveValue(sectionDoc, 'bcl:num'),
    text: retrieveValue(sectionDoc, 'bcl:text'),
    content: []
  };
  let subsectionsDoc = sectionDoc['bcl:subsection'];
  if (subsectionsDoc) {
    for (let subsectionDoc of subsectionsDoc) {
      section.content.push(parseSubSection(subsectionDoc));
    }
    // console.log(sectionsDoc[0])
  }
  let paragraphsDoc = sectionDoc['bcl:paragraph'];
  if (paragraphsDoc) {
    for (let paragraphDoc of paragraphsDoc) {
      section.content.push(parseParagraph(paragraphDoc));
    }
    // console.log(sectionsDoc[0])
  }
  // console.log(section);
  return section;
}

function parseSubSection(subSectionDoc) {
  let subSection = {
    id: retrieveId(subSectionDoc),
    type: "SubSection",
    text: retrieveValue(subSectionDoc, 'bcl:text'),
    num: retrieveValue(subSectionDoc, 'bcl:num'),
    content: []
  };
  let paragraphsDoc = subSectionDoc['bcl:paragraph'];
  if (paragraphsDoc) {
    for (let paragraphDoc of paragraphsDoc) {
      subSection.content.push(parseParagraph(paragraphDoc));
    }
    // console.log(sectionsDoc[0])
  }
  let definitionsDoc = subSectionDoc['bcl:definition'];
  if (definitionsDoc) {
    for (let definitionDoc of definitionsDoc) {
      subSection.content.push(parseDefinition(definitionDoc));
    }
    // console.log(sectionsDoc[0])
  }
  return subSection;
}

function parseParagraph(paragraphDoc) {
  let paragraph = {
    id: retrieveId(paragraphDoc),
    type: "Paragraph",
    text: retrieveValue(paragraphDoc, 'bcl:text'),
    num: retrieveValue(paragraphDoc, 'bcl:num'),
  };
  return paragraph;
}

function parseDefinition(definitionDoc) {
  let definition = {
    id: retrieveId(definitionDoc),
    type: "Definition",
    text: "Placeholder",
    links: []
  };
  let textDoc = retrieveValue(definitionDoc, 'bcl:text');
  if (textDoc) {
    console.log("TEXT: " + JSON.stringify(textDoc));
    definition.term = retrieveValue(textDoc, 'in:term');
    let textData = textDoc['$$'];
    let linkData = textDoc['bcl:link'];
    if (textData) {
      if (textData.length === 1) {
        definition.text = textData[0];
      } else {
        let text = [textData[0][0]];
        if (linkData) {
          for (let x=0; x<linkData.length; x++) {
            let link = {
              href: linkData[x]['$']['xlink:href'],
              resourceType: linkData[x]['$']['resource'],
              text: linkData[x]['in:doc'][0],
            };
            definition.links.push(link);
            text.push('${' + link.href + '}')
            text.push(textData[x])
          }
        }
        definition.text = text.join('');
      }
    }
  }
  let paragraphsDoc = definitionDoc['bcl:paragraph'];
  if (paragraphsDoc) {
    // TODO: Add text content to definition text
  }

  return definition;
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
      parseString(result.data, { explicitChildren: true, preserveChildrenOrder: true }, function (err, resultJson) {
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
            parseString(val.data, { explicitChildren: true, preserveChildrenOrder: true }, function (err, resultJson) {

              let actDoc = resultJson['act:act'];
              let contentDoc = retrieveValue(actDoc, 'act:content');
              if (act.id === undefined) {
                act.id = retrieveId(actDoc);
                act.title = retrieveValue(actDoc, 'act:title');
                act.chapter = retrieveValue(actDoc, 'act:chapter');
                act.yearEnacted = retrieveValue(actDoc, 'act:yearenacted');
                act.assentedTo = retrieveValue(actDoc, 'act:assentedto');

                console.log(`id: ${act.id}, title: ${act.title}, chapter: ${act.chapter}, yearEnacted: ${act.yearEnacted}, assentedTo: ${act.assentedTo}`);
              }
              if (contentDoc['bcl:part']) {
                let partDoc = retrieveValue(contentDoc, 'bcl:part');
                let sectionsDoc = partDoc['bcl:section'];
                let divisionsDoc = partDoc['bcl:division'];
                let part = {
                  id: retrieveId(partDoc),
                  postfix: contentDoc['$']['postfix'],
                  num: retrieveValue(partDoc, 'bcl:num'),
                  text: retrieveValue(partDoc, 'bcl:text'),
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
                //console.log(scheduleDoc)
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
          //console.log(act)
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
