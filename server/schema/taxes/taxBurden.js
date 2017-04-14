import PropertyClassStats from './propertyClassStats';

const TaxBurden = `
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
`;

export default () => [TaxBurden, PropertyClassStats];