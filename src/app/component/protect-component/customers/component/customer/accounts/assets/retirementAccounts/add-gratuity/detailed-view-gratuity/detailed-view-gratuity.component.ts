import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailed-view-gratuity',
  templateUrl: './detailed-view-gratuity.component.html',
  styleUrls: ['./detailed-view-gratuity.component.scss']
})
export class DetailedViewGratuityComponent implements OnInit {

  inputData: any;
  gratuity: any;

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.gratuity = this.inputData
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
