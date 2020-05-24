import {SubscriptionInject} from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-po-mis',
  templateUrl: './detailed-po-mis.component.html',
  styleUrls: ['./detailed-po-mis.component.scss']
})
export class DetailedPoMisComponent implements OnInit {
  nominee: any;
  isLoading = false;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  data;

  ngOnInit() {
    this.nominee = this.data.nominees;
    this.bankList = this.enumService.getBank();

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }


}
