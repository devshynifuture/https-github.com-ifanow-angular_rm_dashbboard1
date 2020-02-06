import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-ifa-borading-history',
  templateUrl: './ifa-borading-history.component.html',
  styleUrls: ['./ifa-borading-history.component.scss']
})
export class IfaBoradingHistoryComponent implements OnInit {

  constructor(public subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


}
