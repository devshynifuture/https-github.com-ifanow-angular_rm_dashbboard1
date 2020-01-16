import { environment } from '../../environments/environment';

export const apiConfig = {
  MAIN_URL: environment.APIEndpoint,
  GMAIL_URL: environment.GmailAPIEndpoint,
  CALENDAR_URL: environment.CalendarAPIEndpoint
}
