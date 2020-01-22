import {SubscriptionInject} from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-detailed-po-mis',
  templateUrl: './detailed-po-mis.component.html',
  styleUrls: ['./detailed-po-mis.component.scss']
})
export class DetailedPoMisComponent implements OnInit {
  nominee: any;

  constructor(private subInjectService: SubscriptionInject) {
  }

  data;

  ngOnInit() {
    this.nominee=this.data.nominees

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }


}
