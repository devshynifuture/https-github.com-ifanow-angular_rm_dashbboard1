import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-other-payables',
  templateUrl: './detailed-view-other-payables.component.html',
  styleUrls: ['./detailed-view-other-payables.component.scss']
})
export class DetailedViewOtherPayablesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'position'];
  _data: any;
  ownerName: any;
  otherpayables: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(inputData) {
    this._data = inputData;
    console.log('AddLiabilitiesComponent Input data : ', this._data);
    this.otherpayables = this._data

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