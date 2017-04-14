import PropertyClassRates from './propertyClassRates';

const TaxRate = `
  # This represents tax rate data for municipal tax purposes
  type TaxRate {
    municipal: PropertyClassRates
    regionalDistrict: PropertyClassRates
    hospital: PropertyClassRates
    school: PropertyClassRates
    other: PropertyClassRates
    total: PropertyClassRates
  }
`;

export default () => [TaxRate, PropertyClassRates];