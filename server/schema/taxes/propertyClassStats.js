const PropertyClassStats = `
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
`;

export default () => [PropertyClassStats];