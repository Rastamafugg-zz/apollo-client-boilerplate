const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull
} = require('graphql');

// const pmongo = require('promised-mongo');
const MongoClient = require('mongodb').MongoClient;
const strataUrl = 'mongodb://127.0.0.1/strata';
const governmentUrl = 'mongodb://127.0.0.1/government';

const Bylaw = require('./strata');
const TaxData = require('./taxes');

// const strataDb = pmongo('mongodb://127.0.0.1/strata');
// const authorsCollection = strataDb.collection('authors');
// const bylawsCollection = strataDb.collection('bylaws');
//
// const governmentDb = pmongo('mongodb://127.0.0.1/government');
// const taxesCollection = governmentDb.collection('taxes');

const Query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    bylaws: {
      type: new GraphQLList(Bylaw),
      resolve: () => {
        return new Promise((resolve, reject) => {
          MongoClient.connect(strataUrl).then(db => {
            let result = [];
            let cursor = db.collection('bylaws').find();
            cursor.each(function(err, doc) {
              if (doc != null) {
                console.log(doc);
                result.push(doc);
              } else {
                console.log("Closing");
                db.close();
                console.log(`result: ${result}`);
                resolve(result);
              }
            });
          }).catch(err => {
            console.log(`error: ${err}`);
          });
        });
      }
    },
    taxes: {
      type: new GraphQLList(TaxData),
      args: {
        municipality: {type: GraphQLString},
        year: {type: GraphQLInt},
        regionalDistrict: {type: GraphQLString},
      },
      resolve: () => {
        return new Promise((resolve, reject) => {
          MongoClient.connect(governmentUrl).then(db => {
            let result = [];
            let cursor = db.collection('taxes').find();
            cursor.each(function(err, doc) {
              if (doc != null) {
                console.log(doc);
                result.push(doc);
              } else {
                console.log("Closing");
                db.close();
                console.log(`result: ${result}`);
                resolve(result);
              }
            });
          }).catch(err => {
            console.log(`error: ${err}`);
          });
        });
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    // createAuthor: {
    //   type: Author,
    //   args: {
    //     _id: {type: new GraphQLNonNull(GraphQLString)},
    //     name: {type: new GraphQLNonNull(GraphQLString)},
    //     twitterHandle: {type: GraphQLString}
    //   },
    //   resolve: function(rootValue, args) {
    //     let author = Object.assign({}, args);
    //     return authorsCollection.insert(author)
    //       .then(_ => author);
    //   }
    // }
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  // mutation: Mutation
});

module.exports = Schema;
