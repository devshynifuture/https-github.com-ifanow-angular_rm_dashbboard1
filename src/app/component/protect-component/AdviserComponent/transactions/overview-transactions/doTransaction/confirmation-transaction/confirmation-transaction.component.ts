import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-confirmation-transaction',
  templateUrl: './confirmation-transaction.component.html',
  styleUrls: ['./confirmation-transaction.component.scss']
})
export class ConfirmationTransactionComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
