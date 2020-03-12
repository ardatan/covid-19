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
      deaths: confirmed.deaths,
      recovered: confirmed.recovered
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
}

module.exports = Covid19API;
