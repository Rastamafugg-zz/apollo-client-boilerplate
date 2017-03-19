import React, { Component } from 'react';
import { connect } from 'react-redux';

class BCLaws extends Component {
  render() {

    return (
        <h1 className='home'>
          <a onClick={this.props.loadLawIndex}>Load Law List</a>
        </h1>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BCLaws);
