import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
//if(process.env.WEBPACK) require('./index.scss');

class Municipalities extends Component {
  constructor() {
    super();
  }

  render() {
    const { data: {taxes = []} } = this.props;
    //debugger

    return (
        <div className='home'>
          <div>{this.props.regionalDistrict} - {this.props.year}</div>
          {taxes.map((taxData) => (
              <div key={`${taxData.municipality}-${taxData.year}`}>
                <h2>{taxData.municipality}-{taxData.year}</h2>
              </div>
          ))}
        </div>
    );
  }
}

const query = gql`
query Taxes($regionalDistrict: String!, $year: Int!) {
  taxes(regionalDistrict: $regionalDistrict, year: $year) {
    municipality,
    year,
    type,
    regionalDistrict,
    populationEstimate,
    assessedValue {
      residential,
      business,
      lightIndustry,
      majorIndustry,
      utilities,
      managedForest,
      unmanagedForest,
      recreation,
      farm,
      supportiveHousing,
      totalGeneralPurposes,
      totalSchoolPurposes,
      totalHospitalPurposes
    },
    taxRate {
      municipal {
        residential,
        business
        lightIndustry,
        majorIndustry,
        utilities,
        managedForest,
        unmanagedForest,
        recreation,
        farm,
        supportiveHousing,
      },
      regionalDistrict {
        residential,
        business
        lightIndustry,
        majorIndustry,
        utilities,
        managedForest,
        unmanagedForest,
        recreation,
        farm,
        supportiveHousing,
      },
      hospital {
        residential,
        business
        lightIndustry,
        majorIndustry,
        utilities,
        managedForest,
        unmanagedForest,
        recreation,
        farm,
        supportiveHousing,
      },
      school {
        residential,
        business
        lightIndustry,
        majorIndustry,
        utilities,
        managedForest,
        unmanagedForest,
        recreation,
        farm,
        supportiveHousing,
      },
      other {
        residential,
        business
        lightIndustry,
        majorIndustry,
        utilities,
        managedForest,
        unmanagedForest,
        recreation,
        farm,
        supportiveHousing,
      },
      total {
        residential,
        business
        lightIndustry,
        majorIndustry,
        utilities,
        managedForest,
        unmanagedForest,
        recreation,
        farm,
        supportiveHousing,
      }
    },
    taxTotals {
      school,
      generalMunicipal,
      regionalDistrict,
      hospital,
      gvtaVictoriaTransit,
      bcaMfaOther,
      variableRate,
      parcel,
      localAreaServices,
      onePercentUtilities,
      userFees,
      propertyTaxAndCharges
    },
    representativeHouse {
      houseValue,
      school,
      generalMunicipal,
      regionalDistrict,
      hospital,
      bcaMfaOther,
      variableRate,
      parcel,
      specialArea,
      userFees,
      propertyTaxAndCharges
    },
    taxBurden {
      residential {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      business {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      lightIndustry {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      majorIndustry {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      utilities {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      managedForest {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      unmanagedForest {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      recreation {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      farm {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      supportiveHousing {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
      totals {
        generalTaxableValues,
        municipalPurposeTaxRates,
        taxClassMultiples,
        totalMunicipalVariableRateTaxes,
        flatTaxesSplitRateTaxesEtc,
        totalMunicipalTaxes,
        percentTotalTaxes,
        percentTotalAssessment,
        municipalTaxesPerCapita
      },
    },
  }
}`;

export default compose(
    graphql(query),
    connect((state) => {
      return {};
    })
)(Municipalities);
