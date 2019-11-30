import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-scheme-holding',
  templateUrl: './detailed-view-scheme-holding.component.html',
  styleUrls: ['./detailed-view-scheme-holding.component.scss']
})
export class DetailedViewSchemeHoldingComponent implements OnInit {

  inputData: any;
  schemeHoldings: any;

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.schemeHoldings = this.inputData
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
