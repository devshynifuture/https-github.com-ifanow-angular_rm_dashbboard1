import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProcessTransactionService {
  [x: string]: any;
  inverstorList: any;
  schemeSelection : any;
  constructor() { }
  selectionList() {
    this.schemeSelection = [{
      select: 'Invest in existing scheme',
      value : 1
    }, {
      select: 'Select a new scheme',
      value : 2
    }]
  }
  getIINList() {
    this.inverstorList = [
      {
        iin: '5011102595'
      },
      {
        iin: '2011103545'
      }
    ]
    return this.inverstorList
  }
  getDefaultLoginDetials() {

  }
  getEuinList() {

  }

}
