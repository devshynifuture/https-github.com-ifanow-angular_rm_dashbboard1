import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-others',
  templateUrl: './detailed-view-others.component.html',
  styleUrls: ['./detailed-view-others.component.scss']
})
export class DetailedViewOthersComponent{
  others: any;

  constructor(private subInjectService: SubscriptionInject) {
  }
  @Input()
  set data(inputData) {
    this.others = inputData;
  }
  get data() {
    return this.others;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
