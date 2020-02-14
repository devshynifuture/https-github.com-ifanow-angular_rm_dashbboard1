import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-sip-details',
  templateUrl: './sip-details.component.html',
  styleUrls: ['./sip-details.component.scss']
})
export class SipDetailsComponent implements OnInit {

  constructor(private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }
  close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
