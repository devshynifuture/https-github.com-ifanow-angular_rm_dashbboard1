import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from '../../../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-marketplace-review-reply',
  templateUrl: './marketplace-review-reply.component.html',
  styleUrls: ['./marketplace-review-reply.component.scss']
})
export class MarketplaceReviewReplyComponent implements OnInit {
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
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
export interface PeriodicElement {
  name: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Eamil', weight: 'Free', symbol: 'Details'},
  { name: 'Eamil', weight: '0.15/SMS', symbol: 'Details'},
];