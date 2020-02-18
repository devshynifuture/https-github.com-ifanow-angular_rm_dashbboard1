import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-know-your-customer',
  templateUrl: './know-your-customer.component.html',
  styleUrls: ['./know-your-customer.component.scss']
})
export class KnowYourCustomerComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag })
  }


}
