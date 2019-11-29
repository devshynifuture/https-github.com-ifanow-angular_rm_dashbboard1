import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-ssy',
  templateUrl: './detailed-ssy.component.html',
  styleUrls: ['./detailed-ssy.component.scss']
})
export class DetailedSsyComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }
  data;
  ngOnInit() {
    console.log('DetailedSsysComponent ngOnInit data : ',this.data)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
