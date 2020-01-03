import {Component, Input, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-detailded-view-superannuation',
  templateUrl: './detailded-view-superannuation.component.html',
  styleUrls: ['./detailded-view-superannuation.component.scss']
})
export class DetaildedViewSuperannuationComponent implements OnInit {

  inputData: any;
  superannnuation: any;

  constructor(public utils: UtilService, private subInjectService: SubscriptionInject) {
  }

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
