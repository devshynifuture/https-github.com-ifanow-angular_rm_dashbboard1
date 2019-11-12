import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view',
  templateUrl: './detailed-view.component.html',
  styleUrls: ['./detailed-view.component.scss']
})
export class DetailedViewComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });

  }
}
