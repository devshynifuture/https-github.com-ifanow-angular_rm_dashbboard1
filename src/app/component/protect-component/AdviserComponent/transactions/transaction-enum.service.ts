import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionEnumService {

  constructor() { }

  static setPlatformEnum(data) {
    data.forEach(element => {
      element['platformName'] = (element.aggregatorType == 1) ? "NSE" : "BSE"
    });
    return data;
  }
  static setHoldingTypeEnum(data) {
    data.forEach(element => {
      element['holdingTypeName'] = (element.holdingType == 'JO') ? "Joint" : "Single"
    });
    return data;
  }
}
