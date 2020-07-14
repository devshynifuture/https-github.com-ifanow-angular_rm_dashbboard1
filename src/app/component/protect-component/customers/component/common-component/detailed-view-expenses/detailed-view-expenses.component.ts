import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-detailed-view-expenses',
  templateUrl: './detailed-view-expenses.component.html',
  styleUrls: ['./detailed-view-expenses.component.scss']
})
export class DetailedViewExpensesComponent implements OnInit {
  inputData: any;
  income: any;
  monthlyContribution: any[];
  expense: any;

  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.expense = this.inputData
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
