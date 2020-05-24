import {SubscriptionInject} from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-po-td',
  templateUrl: './detailed-po-td.component.html',
  styleUrls: ['./detailed-po-td.component.scss']
})
export class DetailedPoTdComponent implements OnInit {
  data;
  nominee: any;
  isLoading = false;
  bankList:any = [];
  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  ngOnInit() {
    console.log(this.data);
    this.nominee = this.data.nominees;
    this.bankList = this.enumService.getBank();

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}
