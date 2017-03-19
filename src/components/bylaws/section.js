import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
//if(process.env.WEBPACK) require('./index.scss');

class Section extends Component {
  constructor() {
    super();
    this.state = {
      isVisible: false
    };
  }

  toggleSection() {
    this.setState({isVisible: !this.state.isVisible});
  }

  render() {
    const { section } = this.props;

    let subsections = undefined;
    let caret = "caret right";
    if (this.state.isVisible && section.sections) {
      caret = "caret down";
      subsections = section.sections.map((subsection) => (
          <Section section={subsection} key={subsection.section}/>
      ))
    }
    let sectionBody;
    if (section.section && section.title) {
      sectionBody = (
        <List.Item key={section.section} style={{paddingLeft:10}}>
          <List.Icon name={caret} disabled={!section.sections}/>
          <List.Content>
            <List.Header as={'h4'} onClick={(event) => this.toggleSection()}>{section.section} - {section.title}</List.Header>
            <List.Description>{section.text}</List.Description>
            <List.List>
              {subsections}
            </List.List>
          </List.Content>
        </List.Item>
      );
    } else if (section.section) {
      sectionBody = (
          <List.Item key={section.section} style={{paddingLeft:10}}>
            <List.Icon name={caret} disabled={!section.sections}/>
            <List.Content>
              <List.Description onClick={(event) => this.toggleSection()}><strong>{section.section})</strong> {section.text}</List.Description>
              <List.List>
                {subsections}
              </List.List>
            </List.Content>
          </List.Item>);
    } else {
      sectionBody = (
          <List.List key={section.title} style={{paddingLeft:10}}>
            <List.Icon name={caret} disabled={!section.sections}/>
            <List.Content>
              <List.Header as={'h4'} onClick={(event) => this.toggleSection()}>{section.title}</List.Header>
              <List.Description>{section.text}</List.Description>
              <List.List>
                {subsections}
              </List.List>
            </List.Content>
          </List.List>);
    }
    return sectionBody;
  }
}

export default Section;
