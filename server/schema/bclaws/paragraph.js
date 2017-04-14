import SubParagraph from './subParagraph';

const Paragraph = `
  type Paragraph {
    id: String!
    num: Int!
    text: String!
    content: [SubParagraph]
  }
`;

export default () => [Paragraph, SubParagraph];