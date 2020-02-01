import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-ssy',
  templateUrl: './detailed-ssy.component.html',
  styleUrls: ['./detailed-ssy.component.scss']
})
export class DetailedSsyComponent implements OnInit {
  nominee: any;

  constructor(private subInjectService: SubscriptionInject) { }
  data;
  ngOnInit() {
    console.log('DetailedSsysComponent ngOnInit data : ',this.data)
    this.nominee=this.data.nominees;

  }
  
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
