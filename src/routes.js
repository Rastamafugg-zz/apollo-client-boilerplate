import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Home from './components/home';
import Page from './components/page';
import Bylaws from './components/bylaws';
import BCLaws from './components/bclaws';
import Taxes from './components/taxes';

export default (
	<Route path='/'>
		<IndexRoute component={Home} />
		<Route path='page' component={Page} />
		<Route path='bylaws' component={Bylaws} />
		<Route path='taxes' component={Taxes} />
		<Route path='bclaws' component={BCLaws} />
	</Route>
);
