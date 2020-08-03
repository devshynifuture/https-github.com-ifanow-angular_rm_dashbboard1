// export const environment = {
//   production: false,
//   APIEndpoint: 'https://futurewise-elb-001-1896223052.us-east-1.elb.amazonaws.com/futurewise/api/v1/web/',
//   GmailAPIEndpoint: 'https://dev.ifanow.in/email-server/api/v1/web/',
//   TransactionPlatform: 'https://transactplatform-elb-001-1869043218.us-east-1.elb.amazonaws.com/transaction-platform/api/v1/web/',
//   PostalUrl: 'https://api.postalpincode.in/pincode/',
//   UserUrl: 'https://userserver-elb-001-1696785247.us-east-1.elb.amazonaws.com/userserver/api/v1/web/',
//   MarketPlaceUrl: 'https://dev.ifanow.in/marketplace-server/api/v1/web/',
//   hmr: false,
// };

export const environment = {
  production: false,
  APIEndpoint: 'http://dev.ifanow.in:8080/futurewise/api/v1/web/',
  GmailAPIEndpoint: 'http://dev.ifanow.in:8080/email-server/api/v1/web/',
  // TransactionPlatform: 'http://localhost:8080/transaction-platform/api/v1/web/',
  TransactionPlatform: 'http://dev.ifanow.in:8080/transaction-platform/api/v1/web/',
  PostalUrl: 'http://api.postalpincode.in/pincode/',
  UserUrl: 'http://dev.ifanow.in:8080/userserver/api/v1/web/',
  MarketPlaceUrl: 'http://dev.ifanow.in:8080/marketplace-server/api/v1/web/',
  hmr: false,
};
