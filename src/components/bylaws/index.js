import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Division from './division';
import { List, Button, Container, Grid, Header } from 'semantic-ui-react';
//if(process.env.WEBPACK) require('./index.scss');

class Bylaws extends Component {
  render() {
    const { data: {bylaws = []} } = this.props;
    //debugger

    return (
      <Container>
        <Header as={'h1'} content='Bylaws' />
        <List>
        {bylaws.map((bylaw) => (
          <List.Item key={bylaw.property}>
            <List.Content>
              <List.Header as={'h2'} content={bylaw.property} />
              <List.List>
                {bylaw.divisions.map((division) => (
                  <Division key={division.division} division={division} />
                ))}
              </List.List>
            </List.Content>
          </List.Item>
        ))}
        </List>
      </Container>
    );
  }
}

const query = gql`{
  bylaws {
    property,
    divisions {
      division,
      title,
      sections {
        section,
        title,
        text,
        sections {
          section,
          title,
          text,
          sections {
            section,
            title,
            text
          }
        }
      }
    }
  }
}`;

export default compose(
    graphql(query),
    connect((state) => {
      return {};
    })
)(Bylaws);
