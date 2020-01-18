import {SubscriptionInject} from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-detailed-po-td',
  templateUrl: './detailed-po-td.component.html',
  styleUrls: ['./detailed-po-td.component.scss']
})
export class DetailedPoTdComponent implements OnInit {
  data;
  nominee: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    console.log(this.data);
    this.nominee=this.data.nominees;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
