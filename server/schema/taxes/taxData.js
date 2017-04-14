import AssessedValue from './assessedValue';
import TaxRate from './taxRate';
import TaxTotals from './taxTotals';
import RepresentativeHouse from './representativeHouse';
import TaxBurden from './taxBurden';

const TaxData = `
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
`;

export default () => [TaxData, AssessedValue, TaxRate, TaxTotals, RepresentativeHouse, TaxBurden];