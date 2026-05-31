// ============================================================
// CITY SALARY DATA — BLS 2024 Metro Area Medians
// salaryfact.com
// Top 30 US metro areas
// ============================================================

export interface CityData {
  name: string;
  state: string;
  stateCode: string;
  medianSalary: number;
  population: number;
}

export const CITY_DATA: Record<string, CityData> = {
  "new-york": {
    name: "New York",
    state: "New York",
    stateCode: "NY",
    medianSalary: 82000,
    population: 8336817,
  },
  "los-angeles": {
    name: "Los Angeles",
    state: "California",
    stateCode: "CA",
    medianSalary: 71000,
    population: 3979576,
  },
  "chicago": {
    name: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    medianSalary: 67000,
    population: 2693976,
  },
  "houston": {
    name: "Houston",
    state: "Texas",
    stateCode: "TX",
    medianSalary: 62000,
    population: 2304580,
  },
  "phoenix": {
    name: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    medianSalary: 60000,
    population: 1608139,
  },
  "philadelphia": {
    name: "Philadelphia",
    state: "Pennsylvania",
    stateCode: "PA",
    medianSalary: 65000,
    population: 1603797,
  },
  "san-antonio": {
    name: "San Antonio",
    state: "Texas",
    stateCode: "TX",
    medianSalary: 56000,
    population: 1434625,
  },
  "san-diego": {
    name: "San Diego",
    state: "California",
    stateCode: "CA",
    medianSalary: 73000,
    population: 1386932,
  },
  "dallas": {
    name: "Dallas",
    state: "Texas",
    stateCode: "TX",
    medianSalary: 64000,
    population: 1304379,
  },
  "san-jose": {
    name: "San Jose",
    state: "California",
    stateCode: "CA",
    medianSalary: 112000,
    population: 1013240,
  },
  "austin": {
    name: "Austin",
    state: "Texas",
    stateCode: "TX",
    medianSalary: 72000,
    population: 961855,
  },
  "jacksonville": {
    name: "Jacksonville",
    state: "Florida",
    stateCode: "FL",
    medianSalary: 58000,
    population: 949611,
  },
  "fort-worth": {
    name: "Fort Worth",
    state: "Texas",
    stateCode: "TX",
    medianSalary: 62000,
    population: 927720,
  },
  "columbus": {
    name: "Columbus",
    state: "Ohio",
    stateCode: "OH",
    medianSalary: 61000,
    population: 905748,
  },
  "charlotte": {
    name: "Charlotte",
    state: "North Carolina",
    stateCode: "NC",
    medianSalary: 65000,
    population: 874579,
  },
  "indianapolis": {
    name: "Indianapolis",
    state: "Indiana",
    stateCode: "IN",
    medianSalary: 58000,
    population: 887642,
  },
  "san-francisco": {
    name: "San Francisco",
    state: "California",
    stateCode: "CA",
    medianSalary: 116000,
    population: 873965,
  },
  "seattle": {
    name: "Seattle",
    state: "Washington",
    stateCode: "WA",
    medianSalary: 94000,
    population: 737255,
  },
  "denver": {
    name: "Denver",
    state: "Colorado",
    stateCode: "CO",
    medianSalary: 75000,
    population: 715522,
  },
  "washington-dc": {
    name: "Washington DC",
    state: "District of Columbia",
    stateCode: "DC",
    medianSalary: 95000,
    population: 689545,
  },
  "boston": {
    name: "Boston",
    state: "Massachusetts",
    stateCode: "MA",
    medianSalary: 88000,
    population: 675647,
  },
  "nashville": {
    name: "Nashville",
    state: "Tennessee",
    stateCode: "TN",
    medianSalary: 62000,
    population: 689447,
  },
  "oklahoma-city": {
    name: "Oklahoma City",
    state: "Oklahoma",
    stateCode: "OK",
    medianSalary: 54000,
    population: 681054,
  },
  "el-paso": {
    name: "El Paso",
    state: "Texas",
    stateCode: "TX",
    medianSalary: 48000,
    population: 678815,
  },
  "portland": {
    name: "Portland",
    state: "Oregon",
    stateCode: "OR",
    medianSalary: 72000,
    population: 652503,
  },
  "las-vegas": {
    name: "Las Vegas",
    state: "Nevada",
    stateCode: "NV",
    medianSalary: 58000,
    population: 641903,
  },
  "memphis": {
    name: "Memphis",
    state: "Tennessee",
    stateCode: "TN",
    medianSalary: 52000,
    population: 633104,
  },
  "louisville": {
    name: "Louisville",
    state: "Kentucky",
    stateCode: "KY",
    medianSalary: 57000,
    population: 633045,
  },
  "baltimore": {
    name: "Baltimore",
    state: "Maryland",
    stateCode: "MD",
    medianSalary: 72000,
    population: 585708,
  },
  "milwaukee": {
    name: "Milwaukee",
    state: "Wisconsin",
    stateCode: "WI",
    medianSalary: 60000,
    population: 577222,
  },
};

export const CITY_SLUGS = Object.keys(CITY_DATA);
