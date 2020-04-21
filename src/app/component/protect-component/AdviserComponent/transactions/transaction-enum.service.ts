import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionEnumService {

  constructor() {
  }

  static setPlatformEnum(data) {
    if (data) {
      data.forEach(element => {
        element.platformName = (element.aggregatorType == 1) ? 'NSE' : 'BSE';
      });
      return data;
    } else {
      return;
    }
  }

  static setHoldingTypeEnum(data) {
    data.forEach(element => {
      element.holdingTypeName = (element.holdingType == 'JO') ? 'Joint' : (element.holdingType == 'AS') ? 'Anyone or Survivor' : 'Single';
    });
    return data;
  }

  static setTransactionStatus(data) {
    data.forEach(element => {
      element.transactionStatus = (element.status == 0) ? 'UNKNOWN' : (element.status == 1) ? 'FAILURE' : (element.status == 2) ? 'PENDING AUTHORIZATION' : (element.status == 3) ? 'OTP AUTHORISED' : (element.status == 4) ? 'Pending submission to AMC' : (element.status == 5) ? 'Order submitted to AMC' : (element.status == 6) ? 'Order processed' : (element.status == 7) ? 'Transaction rejected' : 'Order processed';
    });
    return data;
  }
}
