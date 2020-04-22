import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-marketplace-review-reply',
  templateUrl: './marketplace-review-reply.component.html',
  styleUrls: ['./marketplace-review-reply.component.scss']
})
export class MarketplaceReviewReplyComponent implements OnInit {
  data = {flag: ''};

  constructor(
    private subscriptionInject: SubscriptionInject
  ) {
  }

  ngOnInit() {
  }

  dialogClose() {
    this.subscriptionInject.changeNewRightSliderState({state: 'close', refreshRequired: true});
  }

}
