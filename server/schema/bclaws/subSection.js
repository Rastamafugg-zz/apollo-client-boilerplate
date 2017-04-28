import SubSectionContent from './subSectionContent';
import ContentType from './contentType';

const SubSection = `
  type SubSection {
    id: String!
    type: ContentType!
    num: String!
    text: String!
    content: [SubSectionContent]
  }
`;

export default () => [SubSection, SubSectionContent, ContentType];