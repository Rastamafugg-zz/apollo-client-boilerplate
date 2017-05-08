import axios from 'axios';
import xamel from 'xamel';
import { BCLAWS_URL, BCLAWS_DOC_URL } from '../config';

function fetchChildNode(xml, nodeName, allowMultipleValues = false) {
  let childNodes = xml.$(nodeName);
  if (childNodes.length === 0) {
    console.error(`${nodeName} node not found in returned XML document.`);
  } else if (childNodes.length === 1) {
    return childNodes.eq(0);
  } else {
    if (allowMultipleValues) {
      return childNodes;
    } else {
      console.error(`Too many ${nodeName} nodes not found in returned XML document.`);
    }
  }
}

function parseDivision(divisionDoc) {
  let division = {
    id: divisionDoc.attr('id'),
    text: divisionDoc.$('bcl:text/text()'),
    num: divisionDoc.$('bcl:num/text()'),
  };
  let sectionDocs = divisionDoc.$('bcl:section');
  if (sectionDocs && sectionDocs.length > 0) {
    division.sections = [];
    for (let x=0; x < sectionDocs.length; x++) {
      let sectionDoc = sectionDocs.eq(x);
      division.sections.push(parseSection(sectionDoc));
    }
  }
  return division;
}

function parseSection(sectionDoc) {
  let section = {
    id: sectionDoc.attr('id'),
    marginalNote: sectionDoc.$('bcl:marginalnote/text()'),
    num: sectionDoc.$('bcl:num/text()'),
    text: sectionDoc.$('bcl:text/text()'),
    content: []
  };
  let subsectionsDoc = sectionDoc.$('bcl:subsection');
  if (subsectionsDoc) {
    for (let x=0; x < subsectionsDoc.length; x++) {
      let subsectionDoc = subsectionsDoc.eq(x);
      section.content.push(parseSubSection(subsectionDoc));
    }
    // console.log(sectionsDoc[0])
  }
  let paragraphsDoc = sectionDoc.$('bcl:paragraph');
  if (paragraphsDoc) {
    for (let x=0; x < paragraphsDoc.length; x++) {
      let paragraphDoc = paragraphsDoc.eq(x);
      section.content.push(parseParagraph(paragraphDoc));
    }
    // console.log(sectionsDoc[0])
  }
  // console.log(section);
  return section;
}

function parseSubSection(subSectionDoc) {
  let subSection = {
    id: subSectionDoc.attr('id'),
    type: "SubSection",
    text: subSectionDoc.$('bcl:text/text()'),
    num: subSectionDoc.$('bcl:num/text()'),
    content: []
  };
  let paragraphsDoc = subSectionDoc.$('bcl:paragraph');
  if (paragraphsDoc) {
    for (let x=0; x < paragraphsDoc.length; x++) {
      let paragraphDoc = paragraphsDoc.eq(x);
      subSection.content.push(parseParagraph(paragraphDoc));
    }
    // console.log(sectionsDoc[0])
  }
  let definitionsDoc = subSectionDoc.$('bcl:definition');
  if (definitionsDoc) {
    for (let x=0; x < definitionsDoc.length; x++) {
      let definitionDoc = definitionsDoc.eq(x);
      subSection.content.push(parseDefinition(definitionDoc));
    }
    // console.log(sectionsDoc[0])
  }
  return subSection;
}

function parseParagraph(paragraphDoc) {
  let paragraph = {
    id: paragraphDoc.attr('id'),
    type: "Paragraph",
    text: paragraphDoc.$('bcl:text/text()'),
    num: paragraphDoc.$('bcl:num/text()'),
  };
  return paragraph;
}

function parseDefinition(definitionDoc) {
  let definition = {
    id: definitionDoc.attr('id'),
    type: "Definition",
    term: definitionDoc.$('bcl:text/in:term/text()'),
    text: definitionDoc.$('bcl:text/text()'),
    links: []
  };
  // let textDoc = fetchChildNode(definitionDoc, 'bcl:text');
  // if (textDoc) {
  //   //console.log("TEXT: " + JSON.stringify(textDoc));
  //   definition.term = textDoc.$('in:term/text()');
  //   let textData = textDoc['$$'];
  //   let linkData = textDoc.$('bcl:link');
  //   if (textData) {
  //     if (textData.length === 1) {
  //       definition.text = textData[0];
  //     } else {
  //       let text = [textData[0][0]];
  //       if (linkData) {
  //         for (let x=0; x<linkData.length; x++) {
  //           let link = {
  //             href: linkData[x]['$']['xlink:href'],
  //             resourceType: linkData[x]['$']['resource'],
  //             text: linkData[x]['in:doc'][0],
  //           };
  //           definition.links.push(link);
  //           text.push('${' + link.href + '}')
  //           text.push(textData[x])
  //         }
  //       }
  //       definition.text = text.join('');
  //     }
  //   }
  // }
  // let paragraphsDoc = definitionDoc['bcl:paragraph'];
  // if (paragraphsDoc) {
  //   // TODO: Add text content to definition text
  // }

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
      xamel.parse(result.data, function(err, xml) {
        // console.log(JSON.stringify(xml));
        let documents = xml.$('root/document');
        let content = [];
        if (documents) {
          for (let x=0; x < documents.length; x++) {
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
        }
        content.sort((a, b) => a.order - b.order);
        console.log(content);
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

            xamel.parse(val.data, function(err, xml) {
            //   console.log(JSON.stringify(xml));
            // });
            //
            // xmlParser.parseString(val.data, { explicitChildren: true, preserveChildrenOrder: true }, function (err, resultJson) {

              let actDoc = fetchChildNode(xml, 'act:act');
              //console.log(JSON.stringify(actDoc));
              if (act.id === undefined) {
                act.id = actDoc.attr('id');
                act.title = actDoc.$('act:title/text()');
                act.chapter = actDoc.$('act:chapter/text()');
                act.yearEnacted = actDoc.$('act:yearenacted/text()');
                act.assentedTo = actDoc.$('act:assentedto/text()');

                //console.log(`id: ${act.id}, title: ${act.title}, chapter: ${act.chapter}, yearEnacted: ${act.yearEnacted}, assentedTo: ${act.assentedTo}`);
              }
              // console.log("CON: " + JSON.stringify(contentDoc));
              let contentDoc = fetchChildNode(actDoc, 'act:content');
              let partDoc = fetchChildNode(contentDoc, 'bcl:part');
              if (partDoc) {
                let part = {
                  id: partDoc.attr('id'),
                  postfix: contentDoc.attr('postfix'),
                  num: partDoc.$('bcl:num/text()'),
                  text: partDoc.$('bcl:text/text()'),
                };

                if (part.id === 'd2e25') {
                  console.log(`DEFINITION PART: ${JSON.stringify(partDoc)}`);
                }
                let divisionDocs = fetchChildNode(partDoc, 'bcl:division', true);
                if (divisionDocs && divisionDocs.length > 0) {
                  part.content = [];
                  for (let x=0; x < divisionDocs.length; x++) {
                    let divisionDoc = divisionDocs.eq(x);
                    let result = parseDivision(divisionDoc);
                    console.log("DIVISION: " + JSON.stringify(result));
                    part.content.push(result);
                    // part.content.push(parseDivision(divisionDoc));
                  }
                } else {
                  console.log(`No divisions found: ${JSON.stringify(divisionDocs)}`);
                }

                let sectionDocs = partDoc.$('bcl:section');
                if (sectionDocs) {
                  part.content = [];
                  if (sectionDocs.name === 'bcl:section') {
                    let result = parseSection(sectionDocs);
                    part.content.push(result);
                  } else {
                    console.log(`MULTIPLE SECTIONS: ${JSON.stringify(sectionDocs)}`);
                    for (let x=0; x < sectionDocs.length; x++) {
                      let sectionDoc = sectionDocs.eq(x);
                      //Hack to filter out non-section nodes returned from the API as workaround for XAMEL bug
                      if (part.id === 'd2e25') {
                        console.log(`DEFINITION SECTION: ${JSON.stringify(sectionDocs)}`);
                      }
                      if (sectionDoc.name !== 'bcl:section') continue;

                      let result = parseSection(sectionDoc);
                      // console.log("SECTION: " + JSON.stringify(result));
                      // if (result.id === null) {
                      //   console.log("ERROR SECTION: " + JSON.stringify(sectionDoc));
                      // }
                      part.content.push(result);
                      // part.content.push(parseSection(sectionDoc));
                    }
                  }
                  // if (part.id === 'd2e25') {
                  //   console.log(`DEFINITION SECTIONS: ${JSON.stringify(sectionDocs)}`);
                  // }
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
              // if (contentDoc['bcl:schedule']) {
              //   let scheduleDoc = contentDoc['bcl:schedule'];
              //   //console.log(scheduleDoc)
              //   // let partDoc = contentDoc['bcl:part'][0];
              //   // let sectionsDoc = partDoc['bcl:section'];
              //   // let part = {
              //   //   id: partDoc['$']['id'],
              //   //   postfix: contentDoc['$']['postfix'],
              //   //   num: partDoc['bcl:num'],
              //   //   text: partDoc['bcl:text'],
              //   // };
              // }
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
