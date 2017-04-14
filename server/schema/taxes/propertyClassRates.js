const PropertyClassRates = `
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
`;

export default () => [PropertyClassRates];