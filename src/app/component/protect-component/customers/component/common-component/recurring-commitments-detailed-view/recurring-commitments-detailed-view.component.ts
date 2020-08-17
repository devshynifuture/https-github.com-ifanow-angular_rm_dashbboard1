import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-recurring-commitments-detailed-view',
  templateUrl: './recurring-commitments-detailed-view.component.html',
  styleUrls: ['./recurring-commitments-detailed-view.component.scss']
})
export class RecurringCommitmentsDetailedViewComponent implements OnInit {
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
