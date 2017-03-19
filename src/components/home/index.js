import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// import { toggleTodo } from '../../actions/todos';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Container, Grid, Header } from 'semantic-ui-react';

if(process.env.WEBPACK) require('./index.scss');

class Home extends Component {
	render() {
		// const { dispatch, todos } = this.props;

		return (
			<Container textAlign='center'>
				<Header content='Open Data Tools' />
				{/*{todos.map((todo) => (*/}
					{/*<div key={ todo.id }>*/}
						{/*<span style={ (todo.checked) ? { textDecoration: 'line-through' } : {} }>{ todo.text } </span>*/}
						{/*<button onClick={() => dispatch(toggleTodo(todo.id))}>Toggle</button>*/}
					{/*</div>*/}
				{/*))}*/}

				<Grid columns={3}>
					<Grid.Column>
						<Link to='/bylaws'>
							<Button primary>Strata Bylaws</Button>
						</Link>
					</Grid.Column>
					<Grid.Column>
						<Link to='/bclaws'>
							<Button primary>BC Laws</Button>
						</Link>
					</Grid.Column>
					<Grid.Column>
						<Link to='/taxes'>
							<Button primary>BC Tax Stats</Button>
						</Link>
					</Grid.Column>
				</Grid>
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
      const { todos } = state;
      return { todos };
    })
)(Home);
