import Paragraph from './paragraph';
import Definition from './definition';

const SubSectionContent = `
  union SubSectionContent = Definition | Paragraph
`;

export default () => [SubSectionContent, Definition, Paragraph];