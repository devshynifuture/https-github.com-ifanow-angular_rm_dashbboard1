import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CancelFlagService {
  cancelFlag: any;

  constructor() { }

  setCancelFlag(flag) {
    this.cancelFlag = flag;
  }

  getCancelFlag() {
    return this.cancelFlag;
  }
}
