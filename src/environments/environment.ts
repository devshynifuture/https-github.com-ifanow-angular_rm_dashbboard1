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
  APIEndpoint: 'https://dev.ifanow.in/futurewise/api/v1/web/',
  GmailAPIEndpoint: 'https://dev.ifanow.in/email-server/api/v1/web/',
  // TransactionPlatform: 'http://localhost/transaction-platform/api/v1/web/',
  TransactionPlatform:
    'https://dev.ifanow.in/transaction-platform/api/v1/web/',
  PostalUrl: 'https://api.postalpincode.in/pincode/',
  UserUrl: 'https://dev.ifanow.in/userserver/api/v1/web/',
  MarketPlaceUrl: false,
  hmr: false,
};
