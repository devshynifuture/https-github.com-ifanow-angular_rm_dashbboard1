import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-nsc',
  templateUrl: './detailed-nsc.component.html',
  styleUrls: ['./detailed-nsc.component.scss']
})
export class DetailedNscComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) {
  }

  data;

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
