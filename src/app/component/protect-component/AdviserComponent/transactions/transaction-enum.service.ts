import {Injectable} from '@angular/core';
import {EnumServiceService} from '../../../../services/enum-service.service';

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

  static setTaxStatusDesc(data, enumServiceService: EnumServiceService) {
    data.forEach(element => {

      if (element.taxStatus) {
        const taxStatusObj = enumServiceService.getTaxStatus()[element.taxStatus];
        if (taxStatusObj) {
          element.taxDesc = taxStatusObj.description;
        }
      }
    });
    return data;

  }

  static setTransactionStatus(data) {
    data.forEach(element => {
      if (element.transactionType == 'ORDER') {
        element.transactionType = 'PURCHASE';
      }
      element.transactionStatus = this.getTransactionStatusFromStatusId(element.status);
    });
    return data;
  }

  static getTransactionStatusFromStatusId(statusId) {
    if (statusId == 0) {
      return 'Unknown';
    } else if (statusId == 1) {
      return 'Failure';
    } else if (statusId == 2) {
      return 'Pending Authorization';
    } else if (statusId == 3) {
      return 'Otp authorized';
    } else if (statusId == 4) {
      return 'Pending submission to AMC';
    } else if (statusId == 5) {
      return 'Order submitted to AMC';
    } else if (statusId == 6) {
      return 'Order processed';
    } else if (statusId == 7) {
      return 'Transaction rejected';
    } else if (statusId == 8) {
      return 'Success';
    } else {
      return 'Other';
    }
  }
}
