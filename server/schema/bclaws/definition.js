import ContentType from './contentType';
import Link from './link';

const Definition = `
  type Definition {
    id: String!
    type: ContentType!
    term: String!
    text: String!
    links: [Link!]
  }
`;

export default () => [Definition, ContentType, Link];