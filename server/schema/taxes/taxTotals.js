const TaxTotals = `
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
`;

export default () => [TaxTotals];