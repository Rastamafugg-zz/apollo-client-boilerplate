import SubSection from './subSection';

const Section = `
  type Section {
    id: String!
    num: String!
    marginalNote: String!
    text: String
    subSections: [Subsection]
  }
`;

export default () => [Section, SubSection];