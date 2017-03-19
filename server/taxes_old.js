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

const TaxData = new GraphQLObjectType({
    name: "TaxData",
    description: "This represents a municipality's tax data for one year",
    fields: () => ({
        _id: {type: new GraphQLNonNull(GraphQLString)},
        municipality: {type: GraphQLString},
        type: {type: GraphQLString},
        year: {type: GraphQLInt},
        regionalDistrict: {type: GraphQLString},
        populationEstimate: {type: GraphQLInt},
        assessedValue: {type: AssessedValue},
        taxRate: {type: TaxRate},
        taxTotals: {type: TaxTotals},
        representativeHouse: {type: RepresentativeHouse},
        taxBurden: {type: TaxBurden},
    })
});

const AssessedValue = new GraphQLObjectType({
    name: "AssessedValue",
    description: "This represents Assessed Value data for municipal tax purposes",
    fields: () => ({
        residential: {type: GraphQLFloat},
        business: {type: GraphQLFloat},
        lightIndustry: {type: GraphQLFloat},
        majorIndustry: {type: GraphQLFloat},
        utilities: {type: GraphQLFloat},
        managedForest: {type: GraphQLFloat},
        unmanagedForest: {type: GraphQLFloat},
        recreation: {type: GraphQLFloat},
        farm: {type: GraphQLFloat},
        supportiveHousing: {type: GraphQLFloat},
        totalGeneralPurposes: {type: GraphQLFloat},
        totalSchoolPurposes: {type: GraphQLFloat},
        totalHospitalPurposes: {type: GraphQLFloat},
    })
});

const TaxRate = new GraphQLObjectType({
    name: "TaxRate",
    description: "This represents tax rate data for municipal tax purposes",
    fields: () => ({
        municipal: {type: PropertyClassRates},
        regionalDistrict: {type: PropertyClassRates},
        hospital: {type: PropertyClassRates},
        school: {type: PropertyClassRates},
        other: {type: PropertyClassRates},
        total: {type: PropertyClassRates},
    })
});

const PropertyClassRates = new GraphQLObjectType({
    name: "PropertyClassRates",
    description: "This represents Property Class tax rate data for a specific tax type for municipal tax purposes",
    fields: () => ({
        residential: {type: GraphQLFloat},
        business: {type: GraphQLFloat},
        lightIndustry: {type: GraphQLFloat},
        majorIndustry: {type: GraphQLFloat},
        utilities: {type: GraphQLFloat},
        managedForest: {type: GraphQLFloat},
        unmanagedForest: {type: GraphQLFloat},
        recreation: {type: GraphQLFloat},
        farm: {type: GraphQLFloat},
        supportiveHousing: {type: GraphQLFloat},
    })
});

const TaxTotals = new GraphQLObjectType({
    name: "TaxTotals",
    description: "This represents tax totals for various tax purposes",
    fields: () => ({
        school: {type: GraphQLFloat},
        generalMunicipal: {type: GraphQLFloat},
        regionalDistrict: {type: GraphQLFloat},
        hospital: {type: GraphQLFloat},
        gvtaVictoriaTransit: {type: GraphQLFloat},
        bcaMfaOther: {type: GraphQLFloat},
        variableRate: {type: GraphQLFloat},
        parcel: {type: GraphQLFloat},
        localAreaServices: {type: GraphQLFloat},
        onePercentUtilities: {type: GraphQLFloat},
        userFees: {type: GraphQLFloat},
        propertyTaxAndCharges: {type: GraphQLFloat},
    })
});

const RepresentativeHouse = new GraphQLObjectType({
    name: "RepresentativeHouse",
    description: "This represents tax data for a Representative House for municipal tax purposes",
    fields: () => ({
        houseValue: {type: GraphQLInt},
        school: {type: GraphQLFloat},
        generalMunicipal: {type: GraphQLFloat},
        regionalDistrict: {type: GraphQLFloat},
        hospital: {type: GraphQLFloat},
        gvtaVictoriaTransit: {type: GraphQLFloat},
        bcaMfaOther: {type: GraphQLFloat},
        variableRate: {type: GraphQLFloat},
        parcel: {type: GraphQLFloat},
        specialArea: {type: GraphQLFloat},
        userFees: {type: GraphQLFloat},
        propertyTaxAndCharges: {type: GraphQLFloat},
    })
});

const TaxBurden = new GraphQLObjectType({
    name: "TaxBurden",
    description: "This represents Tax Burden data for municipal tax purposes",
    fields: () => ({
        residential: {type: PropertyClassStats},
        business: {type: PropertyClassStats},
        lightIndustry: {type: PropertyClassStats},
        majorIndustry: {type: PropertyClassStats},
        utilities: {type: PropertyClassStats},
        managedForest: {type: PropertyClassStats},
        unmanagedForest: {type: PropertyClassStats},
        recreation: {type: PropertyClassStats},
        farm: {type: PropertyClassStats},
        supportiveHousing: {type: PropertyClassStats},
        totals: {type: PropertyClassStats},
    })
});

const PropertyClassStats = new GraphQLObjectType({
    name: "PropertyClassStats",
    description: "This represents tax stats for a specific Property Class for municipal tax purposes",
    fields: () => ({
        generalTaxableValues: {type: GraphQLFloat},
        municipalPurposeTaxRates: {type: GraphQLFloat},
        taxClassMultiples: {type: GraphQLInt},
        totalMunicipalVariableRateTaxes: {type: GraphQLInt},
        flatTaxesSplitRateTaxesEtc: {type: GraphQLFloat},
        totalMunicipalTaxes: {type: GraphQLInt},
        percentTotalTaxes: {type: GraphQLFloat},
        percentTotalAssessment: {type: GraphQLFloat},
        municipalTaxesPerCapita: {type: GraphQLInt},
    })
});

module.exports = TaxData;
