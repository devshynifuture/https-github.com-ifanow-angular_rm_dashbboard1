import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-learn-more-factsheet',
  templateUrl: './learn-more-factsheet.component.html',
  styleUrls: ['./learn-more-factsheet.component.scss']
})
export class LearnMoreFactsheetComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }
  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
