import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-kvp',
  templateUrl: './detailed-kvp.component.html',
  styleUrls: ['./detailed-kvp.component.scss']
})
export class DetailedKvpComponent implements OnInit {
   data;
  constructor(private subInjectService: SubscriptionInject) { }
   
  ngOnInit() {
    console.log('DetailedKvpComponent ngOnInit data : ',this.data)
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
