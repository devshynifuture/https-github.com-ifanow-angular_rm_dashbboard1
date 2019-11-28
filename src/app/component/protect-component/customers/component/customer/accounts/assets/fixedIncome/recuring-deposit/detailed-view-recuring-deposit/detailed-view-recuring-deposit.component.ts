import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-recuring-deposit',
  templateUrl: './detailed-view-recuring-deposit.component.html',
  styleUrls: ['./detailed-view-recuring-deposit.component.scss']
})
export class DetailedViewRecuringDepositComponent implements OnInit {
  inputData: any;
  recuringDeposit: any;

  constructor(private subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.recuringDeposit = this.inputData
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
