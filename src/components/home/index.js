import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../header';
import { toggleTodo } from '../../actions/todos';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
if(process.env.WEBPACK) require('./index.scss');

class Home extends Component {
	render() {
		const { dispatch, todos, data: {bylaws = []} } = this.props;

		return (
			<div className='home'>
        {bylaws.map((bylaw) => (
        		<div key={bylaw.property}>
							<h1>{bylaw.property}</h1>
              {bylaw.divisions.map((division) => (
              		<h2 key={division.division}>{division.division} - {division.title}</h2>
              ))}
						</div>
        ))}
				<Header title='Home' />
				<div>This is home</div>
				<br />
				{todos.map((todo) => (
					<div key={ todo.id }>
						<span style={ (todo.checked) ? { textDecoration: 'line-through' } : {} }>{ todo.text } </span>
						<button onClick={() => dispatch(toggleTodo(todo.id))}>Toggle</button>
					</div>
				))}
				<br/>
				<Link to='/page'>
					<button>Go to page</button>
				</Link>
			</div>
		);
	}
}

const MyQuery = gql`{ bylaws { property, divisions { division, title } } }`;

export default compose(
    graphql(MyQuery),
    connect((state) => {
      const { todos } = state;
      return { todos };
    })
)(Home);
