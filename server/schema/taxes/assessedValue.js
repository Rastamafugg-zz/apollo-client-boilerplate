const AssessedValue = `
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
`;

export default () => [AssessedValue];