import BylawSection from './bylawSection';

const BylawDivision = `
  type BylawDivision {
    division: String!
    title: String
    text: String
    sections: [BylawSection]
  }
`;

export default () => [BylawDivision, BylawSection];