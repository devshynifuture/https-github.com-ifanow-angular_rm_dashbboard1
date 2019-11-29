import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-eps',
  templateUrl: './detailed-view-eps.component.html',
  styleUrls: ['./detailed-view-eps.component.scss']
})
export class DetailedViewEPSComponent implements OnInit {
  inputData: any;
  eps: any;

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.eps = this.inputData
  }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
