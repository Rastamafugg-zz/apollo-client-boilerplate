import path from 'path';
import express from 'express';
import webpack from 'webpack';
import middleware from './src/middleware';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import Schema from './server/index';

const app = express();

if(process.env.NODE_ENV === 'development') {
	const config = require('./webpack.config.dev');
	const compiler = webpack(config);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}));
	app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname, 'src')));
  console.log("Mounting GraphQL Endpoint");
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }));
  console.log("Mounted GraphQL Endpoint");
  console.log("Mounting GraphIQL Endpoint");
  app.use('/graphiql', graphiqlExpress({ endpointURL: "/graphql" }));
  console.log("Mounted GraphIQL Endpoint");
} else if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'dist')));
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }));
}

app.get('*', middleware);

app.listen(3000, '0.0.0.0', (err) => {
	if(err) {
		console.error(err);
	} else {
		console.info('Listening at http://localhost:3000');	
	}
});
