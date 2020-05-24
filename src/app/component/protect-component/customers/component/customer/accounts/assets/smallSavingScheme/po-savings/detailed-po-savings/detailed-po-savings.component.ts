import {SubscriptionInject} from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';
import {Component, OnInit} from '@angular/core';
import {UtilService} from 'src/app/services/util.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-po-savings',
  templateUrl: './detailed-po-savings.component.html',
  styleUrls: ['./detailed-po-savings.component.scss']
})
export class DetailedPoSavingsComponent implements OnInit {
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
