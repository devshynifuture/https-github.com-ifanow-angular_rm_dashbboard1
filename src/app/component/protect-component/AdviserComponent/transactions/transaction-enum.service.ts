import {Injectable} from '@angular/core';
import {EnumServiceService} from '../../../../services/enum-service.service';
import {detailStatusObj} from './transactions-list/transactions-history/detailStatus';

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
      element.transactionStatus = this.getTransactionStatusString(element.status, element.transactionType);
    });
    return data;
  }

  static getTransactionStatusString(status, transactionType) {
    if (!status || status == 0) {
      return 'Unknown';
    } else if (status == 1) {
      return 'Failure';
    } else if (status == 2) {
      return 'Pending authorization';
    } else if (status == 7) {
      return 'Rejected';
    }
    let transactionStatusList = [];
    switch (true) {
      case (transactionType == 'ORDER' || transactionType == 'PURCHASE'):
        transactionStatusList = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      case (transactionType == 'REDEMPTION'):
        transactionStatusList = detailStatusObj.transactionDetailStatus.REDEMPTION;
        break;
      case (transactionType == 'SWP'):
        transactionStatusList = detailStatusObj.transactionDetailStatus.SWP;
        break;
      case (transactionType == 'SWITCH'):
        transactionStatusList = detailStatusObj.transactionDetailStatus.SWITCH;
        break;
      case (transactionType == 'STP'):
        transactionStatusList = detailStatusObj.transactionDetailStatus.STP;
        break;
      case (transactionType == 'SIP'):
        transactionStatusList = detailStatusObj.transactionDetailStatus.ORDER;
        break;
      default:
        console.log('');
    }
    let statusString;
    transactionStatusList.forEach(element => {
      // tslint:disable-next-line:align
      (element.status == status) ? (statusString = element.name) : '';
    });

    return statusString ? statusString : 'Unknown';
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
