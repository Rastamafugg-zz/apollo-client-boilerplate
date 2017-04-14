import Part from './part';

const Act = `
  type Act {
    id: String!
    title: String!
    chapter: Int!
    yearEnacted: Int!
    assentedTo: String!
    parts: [Part!]
  }
`;

export default () => [Act, Part];