import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-cash-in-hand',
  templateUrl: './detailed-view-cash-in-hand.component.html',
  styleUrls: ['./detailed-view-cash-in-hand.component.scss']
})
export class DetailedViewCashInHandComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  cashInHand: any;
  constructor(private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.cashInHand = this._data

  }

  get data() {
    return this._data;
  }
  ngOnInit() {
    console.log('AddLiabilitiesComponent ngOnInit : ', this._data);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
export interface PeriodicElement {
  name: string;
  position: string;

}