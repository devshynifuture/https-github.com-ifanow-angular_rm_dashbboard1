import { SubscriptionInject } from './../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ifa-details',
  templateUrl: './ifa-details.component.html',
  styleUrls: ['./ifa-details.component.scss']
})
export class IfaDetailsComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
