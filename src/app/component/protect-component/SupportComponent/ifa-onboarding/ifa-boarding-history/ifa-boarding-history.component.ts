import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-ifa-boarding-history',
  templateUrl: './ifa-boarding-history.component.html',
  styleUrls: ['./ifa-boarding-history.component.scss']
})
export class IfaBoardingHistoryComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


}
