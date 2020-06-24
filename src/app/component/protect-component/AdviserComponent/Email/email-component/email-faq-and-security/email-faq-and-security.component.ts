import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-email-faq-and-security',
  templateUrl: './email-faq-and-security.component.html',
  styleUrls: ['./email-faq-and-security.component.scss']
})
export class EmailFaqAndSecurityComponent implements OnInit {

  constructor(
    private subInjectService: SubscriptionInject
  ) { }

  ngOnInit() {
  }

  dialogClose(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}
