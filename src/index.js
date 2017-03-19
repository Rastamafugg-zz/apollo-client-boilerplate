import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import createSagaMiddleware from 'redux-saga'
import bcLawsSaga from './sagas'
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

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, composeEnhancers(
		applyMiddleware(sagaMiddleware)
));
const history = syncHistoryWithStore(browserHistory, store);
sagaMiddleware.run(bcLawsSaga);

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
