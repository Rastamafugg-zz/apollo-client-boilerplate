import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import Section from './section';
//if(process.env.WEBPACK) require('./index.scss');

class Division extends Component {
  constructor() {
    super();
    this.state = {
      isVisible: false
    };
  }

  toggleDivision() {
    this.setState({isVisible: !this.state.isVisible});
  }

  render() {
    const { division } = this.props;
    let sections;
    let caret = "caret right";
    // debugger
    if (this.state.isVisible) {
      caret = "caret down";
      sections = (
        <List.List style={{paddingLeft:10}}>
          {division.sections.map((section) => (
              <Section key={section.section} section={section} />
          ))}
        </List.List>
      );
    }

    return (
        <List.Item key={division.division}>
          <List.Icon name={caret}/>
          <List.Content>
            <List.Header as={'h3'} onClick={(event) => this.toggleDivision()}>{division.division} - {division.title}</List.Header>
            {sections}
          </List.Content>
        </List.Item>
    );
  }
}

export default Division;
