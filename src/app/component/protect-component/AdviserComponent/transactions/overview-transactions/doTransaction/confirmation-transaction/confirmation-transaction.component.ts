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
  platformName;
  salutationString;

  constructor(private subInjectService: SubscriptionInject,
              public router: Router,) {
  }

  @Input() set data(data) {
    this.inputData = data;
    this.confirmData = data;
    this.platformName = this.confirmData.aggregatorType == 1 ? 'NSE NMF II' : 'BSE Star MF';
    this.salutationString = this.confirmData.isAdvisorSection ? 'Your client' : 'You';
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
