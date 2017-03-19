export default `
  type Bylaw {
    _id: String!
    property: String!
    document: String!
    divisions: [Division]
  }

  type Division {
    division: String!
    title: String
    text: String
    sections: [Section]
  }

  type Section {
    section: String!
    title: String
    text: String
    sections: [Section]
  }

  type Content {
    title: String!
    documentId: String!
  }

  type LawDocument {
    title: String!
    documentId: String!
    documentType: String!
    documentParent: String!
    documentAncestors: [String]!
    documentVisible: Boolean!
    documentOrder: Int!
  }

  type Law {
    _id: String!
    property: String!
    document: String!
    divisions: [Division]
  }

  # This represents a municipality's tax data for one year
  type TaxData {
        _id: String!
        municipality: String!
        type: String!
        year: Int!
        regionalDistrict: String!
        populationEstimate: Float
        assessedValue: AssessedValue
        taxRate: TaxRate
        taxTotals: TaxTotals
        representativeHouse: RepresentativeHouse
        taxBurden: TaxBurden
  }

  # This represents Assessed Value data for municipal tax purposes
  type AssessedValue {
    residential: Float
    business: Float
    lightIndustry: Float
    majorIndustry: Float
    utilities: Float
    managedForest: Float
    unmanagedForest: Float
    recreation: Float
    farm: Float
    supportiveHousing: Float
    totalGeneralPurposes: Float
    totalSchoolPurposes: Float
    totalHospitalPurposes: Float
  }
  
  # This represents tax rate data for municipal tax purposes
  type TaxRate {
    municipal: PropertyClassRates
    regionalDistrict: PropertyClassRates
    hospital: PropertyClassRates
    school: PropertyClassRates
    other: PropertyClassRates
    total: PropertyClassRates
  }

  # This represents Property Class tax rate data for a specific tax type for municipal tax purposes
  type PropertyClassRates {
    residential: Float
    business: Float
    lightIndustry: Float
    majorIndustry: Float
    utilities: Float
    managedForest: Float
    unmanagedForest: Float
    recreation: Float
    farm: Float
    supportiveHousing: Float
  }
  
  # This represents tax totals for various tax purposes
  type TaxTotals {
    school: Float
    generalMunicipal: Float
    regionalDistrict: Float
    hospital: Float
    gvtaVictoriaTransit: Float
    bcaMfaOther: Float
    variableRate: Float
    parcel: Float
    localAreaServices: Float
    onePercentUtilities: Float
    userFees: Float
    propertyTaxAndCharges: Float
  }
  
  # This represents tax data for a Representative House for municipal tax purposes
  type RepresentativeHouse {
    houseValue: Float,
    school: Float
    generalMunicipal: Float
    regionalDistrict: Float
    hospital: Float
    gvtaVictoriaTransit: Float
    bcaMfaOther: Float
    variableRate: Float
    parcel: Float
    specialArea: Float
    userFees: Float
    propertyTaxAndCharges: Float
  }

  # This represents Tax Burden data for municipal tax purposes
  type TaxBurden {
    residential: PropertyClassStats
    business: PropertyClassStats
    lightIndustry: PropertyClassStats
    majorIndustry: PropertyClassStats
    utilities: PropertyClassStats
    managedForest: PropertyClassStats
    unmanagedForest: PropertyClassStats
    recreation: PropertyClassStats
    farm: PropertyClassStats
    supportiveHousing: PropertyClassStats
    totals: PropertyClassStats
  }
  
  # This represents tax stats for a specific Property Class for municipal tax purposes
  type PropertyClassStats {
    generalTaxableValues: Float
    municipalPurposeTaxRates: Float
    taxClassMultiples: Float
    totalMunicipalVariableRateTaxes: Float
    flatTaxesSplitRateTaxesEtc: Float
    totalMunicipalTaxes: Float
    percentTotalTaxes: Float
    percentTotalAssessment: Float
    municipalTaxesPerCapita: Float
  }

  type Property {
    name: String
    value: String
  }
  
  type Query {
    bylaws(property: String): [Bylaw]
    lawsContent: [Content]
    lawsDocumentList(contentType: String, sectionType: String): [LawDocument]
    taxes(regionalDistrict: String, municipality: String, year: Int): [TaxData]
    propertyValues(collectionName: String, propertyName: String): [Property!]
  }
  
  schema {
    query: Query
  }
`;