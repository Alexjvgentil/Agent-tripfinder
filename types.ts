export interface FlightInfo {
  priceRange: string;
  bestDayToFly: string;
  flightSummary: string;
  airlinesFound: string[];
  searchLink: string;
  sourceWebsite: string;
}

export interface WebSource {
  web: {
    uri: string;
    title: string;
  }
}
