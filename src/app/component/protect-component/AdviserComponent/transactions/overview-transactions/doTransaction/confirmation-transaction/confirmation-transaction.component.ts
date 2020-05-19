import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-confirmation-transaction',
  templateUrl: './confirmation-transaction.component.html',
  styleUrls: ['./confirmation-transaction.component.scss']
})
export class ConfirmationTransactionComponent implements OnInit {
  transactionSummary: any;
  inputData: any;
  isViewInitCalled: any;
  confirmData: any;

  constructor(private subInjectService: SubscriptionInject,
              public router: Router,) {
  }

  @Input() set data(data) {
    this.inputData = data;
    console.log('This is Input ConfirmationTransactionComponent@@  ', data);
    this.confirmData = data;
    if (this.isViewInitCalled) {
      // this.getdataForm('');
    }
  }

  redirctTransaction() {
    this.close();
    this.router.navigate(['admin', 'transactions', 'transactions']);
  }

  get data() {
    return this.inputData;
  }

  ngOnInit() {
    this.transactionSummary = this.inputData;
    this.subInjectService.setRefreshRequired();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: true});
  }
}
