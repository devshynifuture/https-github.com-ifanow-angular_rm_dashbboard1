import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-view-gratuity',
  templateUrl: './detailed-view-gratuity.component.html',
  styleUrls: ['./detailed-view-gratuity.component.scss']
})
export class DetailedViewGratuityComponent implements OnInit {

  inputData: any;
  gratuity: any;
  bankList:any = [];
  constructor(public utils: UtilService, private subInjectService: SubscriptionInject, private enumService: EnumServiceService) {
  }
  ngOnInit() {
    this.gratuity = this.inputData
    this.bankList = this.enumService.getBank();

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
