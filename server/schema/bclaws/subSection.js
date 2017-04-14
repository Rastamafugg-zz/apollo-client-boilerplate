import Paragraph from './paragraph';

const SubSection = `
  type Subsection {
    id: String!
    num: String!
    text: String!
    content: [Paragraph]
  }
`;

export default () => [SubSection, Paragraph];