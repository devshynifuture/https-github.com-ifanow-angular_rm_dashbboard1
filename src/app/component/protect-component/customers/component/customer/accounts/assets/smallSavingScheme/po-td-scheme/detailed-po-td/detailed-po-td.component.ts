import { SubscriptionInject } from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-po-td',
  templateUrl: './detailed-po-td.component.html',
  styleUrls: ['./detailed-po-td.component.scss']
})
export class DetailedPoTdComponent implements OnInit {
  data: Object;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
