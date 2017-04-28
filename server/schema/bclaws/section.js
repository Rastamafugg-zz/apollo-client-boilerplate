import SectionContent from './sectionContent';

const Section = `
  type Section {
    id: String!
    num: String!
    marginalNote: String!
    text: String
    content: [SectionContent]
  }
`;

export default () => [Section, SectionContent];