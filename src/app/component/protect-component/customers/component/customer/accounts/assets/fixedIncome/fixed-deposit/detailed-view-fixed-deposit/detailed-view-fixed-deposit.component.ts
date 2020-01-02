import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-detailed-view-fixed-deposit',
  templateUrl: './detailed-view-fixed-deposit.component.html',
  styleUrls: ['./detailed-view-fixed-deposit.component.scss']
})
export class DetailedViewFixedDepositComponent implements OnInit {
  inputData: any;
  isViewInitCalled = false;
  fixedDeposit: any;
  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of FixedDepositComponent')
  }

  get data() {
    return this.inputData;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
  ngOnInit() {
    console.log('inputData',this.inputData)
    this.fixedDeposit = this.inputData
  }
}
