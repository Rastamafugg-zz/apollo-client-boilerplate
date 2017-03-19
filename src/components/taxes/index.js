import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Municipalities from './municipalities';
//if(process.env.WEBPACK) require('./index.scss');

class Taxes extends Component {
  constructor() {
    super();
    this.state = {
      regionalDistrict: "CAP",
      year: 2016,
    };
  }

  setRegionalDistrict(regionalDistrict) {
    this.setState({regionalDistrict});
  }

  setYear(year) {
    this.setState({year});
  }

  render() {
    const { data: {regionalDistricts, years} } = this.props;
    return (
        <div className='home'>
          <div>
            <select name="year" onChange={(event) => this.setYear(event.target.value)}>
              {
                years && years.map(({name, value}) => (<option key={value} value={value}>{name}</option>))
              }
            </select>
          </div>
          <div>
            <select name="regionalDistrict" onChange={(event) => this.setRegionalDistrict(event.target.value)}>
              {
                regionalDistricts && regionalDistricts.map(({name, value}) => (<option key={value} value={value}>{name}</option>))
              }
            </select>
          </div>
          <Municipalities regionalDistrict={this.state.regionalDistrict} year={this.state.year} />
        </div>
    );
  }
}

const query = gql`
{
  regionalDistricts: propertyValues(collectionName: "taxes", propertyName: "regionalDistrict") {
    name,
    value
  },
  years: propertyValues(collectionName: "taxes", propertyName: "year") {
    name,
    value
  }
}`;

export default compose(
    graphql(query),
    connect((state) => {
      return {};
    })
)(Taxes);
