import Division from './division';
import Section from './section';

const PartContent = `
  union PartContent = Division | Section
`;

export default () => [PartContent, Division, Section];