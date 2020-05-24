import {SubscriptionInject} from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-po-rd',
  templateUrl: './detailed-po-rd.component.html',
  styleUrls: ['./detailed-po-rd.component.scss']
})
export class DetailedPoRdComponent implements OnInit {
  data;
  nominee: any;
  isLoading = false;
  bankList:any = [];
  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  ngOnInit() {
    this.nominee = this.data.nominees;
    this.bankList = this.enumService.getBank();

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }


}
