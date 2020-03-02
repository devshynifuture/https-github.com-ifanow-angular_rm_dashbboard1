import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-income-detailed-view',
  templateUrl: './income-detailed-view.component.html',
  styleUrls: ['./income-detailed-view.component.scss']
})
export class IncomeDetailedViewComponent implements OnInit {
  inputData: any;
  income: any;

  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.income = this.inputData
  }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
