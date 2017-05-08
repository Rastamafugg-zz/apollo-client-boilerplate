import React, { Component } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

class BCLawsDocumentList extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  setLetter(letter) {
    this.setState({letter});
  }

  render() {
    const { data: {lawsDocumentList = []} } = this.props;

    let lawSelector = undefined;//(this.state.letter) ? (<BCLawsDocumentList path={["statreg", this.state.letter]} />) : undefined;
    return (
      <div>
        <select name="lawsByLetter" onChange={(event) => this.setLetter(event.target.value)}>
          {
            lawsDocumentList && lawsDocumentList.map(({title, id}) => (<option key={id} value={id}>{title}</option>))
          }
        </select>
        {lawSelector}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadLawIndex: () => (dispatch({type: "LAWS_INDEX_FETCH_REQUESTED"}))
  }
};


const query = gql`
    query LawsDocument($path: [String]) {
        lawsDocumentList(path: $path) {
            id,
            title,
            location,
            type,
            parent,
            ancestors,
            isVisible,
            order
        }
    }
`;

export default compose(
    graphql(query),
    connect(mapStateToProps, mapDispatchToProps)
)(BCLawsDocumentList);
