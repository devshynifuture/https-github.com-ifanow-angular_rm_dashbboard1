// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIEndpoint: 'http://dev.ifanow.in:8080/futurewise/api/v1/web/',
  GmailAPIEndpoint: 'http://dev.ifanow.in:8080/email-server/api/v1/web/',
  TransactionPlatform: 'http://192.168.0.9:8080/transaction-platform/api/v1/web/',//,
  PostalUrl: 'https://api.postalpincode.in/pincode/',
  // CalendarAPIEndpoint: 'http://dev.ifanow.in:8080/email-server/',
  // GmailAPIEndpoint: 'http://localhost:8090/email-server/api/v1/web/',


  // APIEndpoint: 'http://localhost:8080/futurewise/api/v1/web/'

  // APIEndpoint: 'http://192.168.0.27:8080/futurewise/api/v1/web/'

  //  APIEndpoint:'http://192.168.0.6:8080/' http://192.168.0.27:8080/futurewise/swagger-ui.html
  // APIEndpoint:'http://23.21.238.140:8090/'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
