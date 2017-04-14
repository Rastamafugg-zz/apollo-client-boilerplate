const RepresentativeHouse = `
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
`;

export default () => [RepresentativeHouse];