import { SubscriptionInject } from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-po-rd',
  templateUrl: './detailed-po-rd.component.html',
  styleUrls: ['./detailed-po-rd.component.scss']
})
export class DetailedPoRdComponent implements OnInit {
  data;
  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }


}
