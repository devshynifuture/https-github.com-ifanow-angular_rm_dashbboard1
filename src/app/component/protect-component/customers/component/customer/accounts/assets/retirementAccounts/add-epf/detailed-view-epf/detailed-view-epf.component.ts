import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-detailed-view-epf',
  templateUrl: './detailed-view-epf.component.html',
  styleUrls: ['./detailed-view-epf.component.scss']
})
export class DetailedViewEPFComponent implements OnInit {
  inputData: any;
  epf: any;

  constructor(public utils: UtilService,private subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.epf = this.inputData
  }
  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
