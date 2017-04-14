import PartContent from './partContent';

const Part = `
  type Part {
    id: String!
    postfix: String!
    num: String!
    text: String!
    content: [PartContent]
  }
`;

export default () => [Part, PartContent];