import Section from './section';

const Division = `
  type Division {
    id: String!
    num: String!
    text: String!
    sections: [Section]
  }
`;

export default () => [Division, Section];