import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-detailded-view-superannuation',
  templateUrl: './detailded-view-superannuation.component.html',
  styleUrls: ['./detailded-view-superannuation.component.scss']
})
export class DetaildedViewSuperannuationComponent implements OnInit {

  inputData: any;
  superannnuation: any;

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.superannnuation = this.inputData
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
