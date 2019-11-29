import { SubscriptionInject } from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-po-savings',
  templateUrl: './detailed-po-savings.component.html',
  styleUrls: ['./detailed-po-savings.component.scss']
})
export class DetailedPoSavingsComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }
  data: Object;
  ngOnInit() {
  }


  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
