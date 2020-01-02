import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-detailed-view-bonds',
  templateUrl: './detailed-view-bonds.component.html',
  styleUrls: ['./detailed-view-bonds.component.scss']
})
export class DetailedViewBondsComponent implements OnInit {
  inputData: any;
  bonds: any;

  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.bonds = this.inputData
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
