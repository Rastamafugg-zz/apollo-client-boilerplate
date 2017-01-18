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

const Bylaw = new GraphQLObjectType({
    name: "Bylaw",
    description: "This represents a Bylaw",
    fields: () => ({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        property: {type: GraphQLString},
        document: {type: GraphQLString},
        divisions: {
            type: new GraphQLList(Division)
        },
    })
});

const Division = new GraphQLObjectType({
    name: "Division",
    description: "This represents a Division",
    fields: () => ({
        division: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        text: {type: GraphQLString},
        sections: {
            type: new GraphQLList(Section)
        },
    })
});

const Section = new GraphQLObjectType({
    name: "Section",
    description: "This represents a Section",
    fields: () => ({
        section: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLString},
        text: {type: GraphQLString},
        sections: {
            type: new GraphQLList(Section)
        },
    })
});

module.exports = Bylaw;
