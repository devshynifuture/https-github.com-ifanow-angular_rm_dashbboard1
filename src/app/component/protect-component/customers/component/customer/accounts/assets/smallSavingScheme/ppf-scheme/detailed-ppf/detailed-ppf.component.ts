import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-ppf',
  templateUrl: './detailed-ppf.component.html',
  styleUrls: ['./detailed-ppf.component.scss']
})
export class DetailedPpfComponent implements OnInit {
  data;
  nominee: any;
  isLoading = false;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  clientFamilybankList:any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log('bank', this.clientFamilybankList);
    console.log(this.data);
    this.nominee = this.data.nominees;

  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }


}
