import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import todos from './reducers/todos';
import routes from './routes';

const client = new ApolloClient();
const rootReducer = combineReducers({
  routing: routerReducer,
  todos: todos,
  apollo: client.reducer()
});

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const history = syncHistoryWithStore(browserHistory, store);

render(
	<ApolloProvider store={store} client={client}>
		<Router history={history}>
			{ routes }
		</Router>
	</ApolloProvider>,
	document.getElementById('app')
);

if(process.env.NODE_ENV == 'development' && module.hot) {
	module.hot.accept('./reducers', () => {
		store.replaceReducer(require('./reducers').default);
	});
}
