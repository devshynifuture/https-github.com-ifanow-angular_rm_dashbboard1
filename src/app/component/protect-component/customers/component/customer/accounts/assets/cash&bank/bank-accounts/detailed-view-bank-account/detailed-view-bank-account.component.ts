import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-view-bank-account',
  templateUrl: './detailed-view-bank-account.component.html',
  styleUrls: ['./detailed-view-bank-account.component.scss']
})
export class DetailedViewBankAccountComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  bankAccount: any;
  isLoading = false;
  bankList:any = [];
  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.bankAccount = this._data;

  }

  get data() {
    return this._data;
  }

  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
    this.bankList = this.enumService.getBank();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}

export interface PeriodicElement {
  name: string;
  position: string;

}
