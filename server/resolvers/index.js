import bylaws from './bylaws';
import taxes from './taxes';
import propertyValues from './propertyValues';
import lawsDocumentList from './lawsDocumentList';
import lawsDocument from './lawsDocument';

/*
 {laws {
 title,
 documentId
 }}

 {lawsDocument(path: ["statreg", "1527898742", "98043", "1138648009"]) {
 title,
 chapter,
 yearEnacted,
 assentedTo,
 parts {
 id,
 postfix,
 num,
 text,
 content {
 ... on Division {
 id,
 text,
 num
 }
 ... on Section {
 id,
 marginalNote,
 num
 }
 }
 }
 }} */
export default {
  Query: {
    bylaws,
    lawsDocumentList,
    lawsDocument,
    taxes,
    propertyValues
  },
  PartContent: {
    __resolveType(obj, context, info){
      if (obj.marginalNote) {
        return 'Section';
      } else {
        return 'Division';
      }
    }
  }
}