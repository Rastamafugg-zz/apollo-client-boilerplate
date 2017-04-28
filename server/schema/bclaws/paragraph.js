import SubParagraph from './subParagraph';
import ContentType from './contentType';

const Paragraph = `
  type Paragraph {
    id: String!
    type: ContentType!
    num: String!
    text: String!
    content: [SubParagraph]
  }
`;

export default () => [Paragraph, SubParagraph, ContentType];