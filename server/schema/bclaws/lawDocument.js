const LawDocument = `
  type LawDocument {
    title: String!
    id: String!
    location: String
    type: String
    parent: String
    ancestors: [String]
    isVisible: Boolean
    order: Int
  }
`;

export default () => [LawDocument];