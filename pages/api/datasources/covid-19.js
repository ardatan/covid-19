const { RESTDataSource } = require("apollo-datasource-rest");

class Covid19API extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://covid19.mathdro.id/api";
  }

  async getAllCases() {
    const response = await this.get("confirmed");
    return Array.isArray(response)
      ? response.map(confirmed => this.caseReducer(confirmed))
      : [];
  }

  caseReducer(confirmed) {
    return {
      provinceState: confirmed.provinceState,
      countryRegion: confirmed.countryRegion,
      lastUpdate: confirmed.lastUpdate,
      lat: confirmed.lat,
      long: confirmed.long,
      confirmed: confirmed.confirmed,
      recovered: confirmed.recovered,
      deaths: confirmed.deaths,
      active: confirmed.active,
      admin2: confirmed.admin2,
      fips: confirmed.fips,
      combinedKey: confirmed.combinedKey,
      iso2: confirmed.iso2,
      iso3: confirmed.iso3
    };
  }

  async getCount() {
    const response = await this.get("/");
    return {
      confirmed: response.confirmed.value,
      recovered: response.recovered.value,
      deaths: response.deaths.value
    };
  }

  async getDaily() {
    const response = await this.get("daily");
    return Array.isArray(response)
      ? response.map(daily => this.dailyReducer(daily))
      : [];
  }

  dailyReducer(daily) {
    return {
      reportDate: daily.reportDate,
      mainlandChina: daily.mainlandChina,
      otherLocations: daily.otherLocations,
      totalConfirmed: daily.totalConfirmed,
      totalRecovered: daily.totalRecovered,
      reportDateString: daily.reportDateString,
      deltaConfirmed: daily.deltaConfirmed,
      deltaRecovered: daily.deltaRecovered,
      objectid: daily.objectid
    };
  }
}

module.exports = Covid19API;
