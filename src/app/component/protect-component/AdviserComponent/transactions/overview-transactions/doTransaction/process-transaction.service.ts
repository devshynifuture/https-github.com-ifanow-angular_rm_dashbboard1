import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProcessTransactionService {
  inverstorList: any;

  constructor() { }
  getIINList(){
    this.inverstorList = [
      {
        iin:'5011102595'
      },
      {
        iin:'2011103545'
      }
    ]
    return this.inverstorList
  }
  getDefaultLoginDetials(){

  }
  getEuinList(){
    
  }

}
