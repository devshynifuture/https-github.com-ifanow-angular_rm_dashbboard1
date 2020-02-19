import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-confirmation-transaction',
  templateUrl: './confirmation-transaction.component.html',
  styleUrls: ['./confirmation-transaction.component.scss']
})
export class ConfirmationTransactionComponent implements OnInit {
  transactionSummary: any;
  inputData: any;
  isViewInitCalled: any;

  constructor(private subInjectService: SubscriptionInject) { }
  @Input() set data(data) {
    this.inputData = data;
    console.log('This is Input ConfirmationTransactionComponent@@  ', data);
    this.transactionSummary = data
    if (this.isViewInitCalled) {
      // this.getdataForm('');
    }
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.transactionSummary = this.inputData
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
