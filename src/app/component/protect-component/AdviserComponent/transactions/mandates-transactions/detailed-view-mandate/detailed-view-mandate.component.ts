import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from '../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-mandate',
  templateUrl: './detailed-view-mandate.component.html',
  styleUrls: ['./detailed-view-mandate.component.scss']
})
export class DetailedViewMandateComponent implements OnInit {
  data;
  details: any;
  constructor(private subInjectService : SubscriptionInject) { }

  ngOnInit() {
  this.details = this.data
  console.log('mandateDetails',this.data)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
