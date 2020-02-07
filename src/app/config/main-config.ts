import { environment } from '../../environments/environment';

export const apiConfig = {
  MAIN_URL: environment.APIEndpoint,
  GMAIL_URL: environment.GmailAPIEndpoint,
  TRANSACT: environment.TransactionPlatform
  // POSTAL_URL : environment.PostalUrl,
  // CALENDAR_URL: environment.CalendarAPIEndpoint
}
