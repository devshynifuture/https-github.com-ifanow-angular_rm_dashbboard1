import { environment } from '../../environments/environment';

export const apiConfig = {
  MAIN_URL: environment.APIEndpoint,
  GMAIL_URL: environment.GmailAPIEndpoint,
  TRANSACT: environment.TransactionPlatform,
  USER: environment.UserUrl,
  MARKET_PLACE:environment.MarketPlaceUrl
  // POSTAL_URL : environment.PostalUrl,
  // CALENDAR_URL: environment.CalendarAPIEndpoint
}
