import { environment } from '../../environments/environment';

export const apiConfig = {
  MAIN_URL: environment.APIEndpoint,
  GMAIL_URL: environment.GmailAPIEndpoint,
  TRANSACT: environment.TransactionPlatform,
  GOAL: environment.GoalPlatform,
  USER: environment.UserUrl,
  MARKET_PLACE: environment.MarketPlaceUrl,
  PRODUCTION: environment.production,
  // Prod_local: environment.Prod_local
  // POSTAL_URL : environment.PostalUrl,
  // CALENDAR_URL: environment.CalendarAPIEndpoint
};
