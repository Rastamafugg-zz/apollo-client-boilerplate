const BylawSection = `
  type BylawSection {
    section: String!
    title: String
    text: String
    sections: [BylawSection]
  }
`;

export default () => [BylawSection];