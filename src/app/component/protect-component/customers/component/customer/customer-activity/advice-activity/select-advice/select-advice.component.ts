import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-select-advice',
  templateUrl: './select-advice.component.html',
  styleUrls: ['./select-advice.component.scss']
})
export class SelectAdviceComponent implements OnInit {


  constructor(public subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }
  Close(state) {
    this.subInjectService.changeUpperRightSliderState({ state: 'close' });
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
