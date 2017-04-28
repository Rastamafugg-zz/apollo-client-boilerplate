import Paragraph from './paragraph';
import SubSection from './subSection';

const SectionContent = `
  union SectionContent = SubSection | Paragraph
`;

export default () => [SectionContent, SubSection, Paragraph];