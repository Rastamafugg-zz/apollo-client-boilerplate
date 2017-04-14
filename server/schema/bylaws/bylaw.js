import BylawDivision from './bylawDivision';

const Bylaw = `
  type Bylaw {
    _id: String!
    property: String!
    document: String!
    divisions: [BylawDivision]
  }
`;

export default () => [Bylaw, BylawDivision];