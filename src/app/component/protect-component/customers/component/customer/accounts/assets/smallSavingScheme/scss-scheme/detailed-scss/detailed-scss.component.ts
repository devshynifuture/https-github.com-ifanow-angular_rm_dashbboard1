import {Component, OnInit} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-detailed-scss',
  templateUrl: './detailed-scss.component.html',
  styleUrls: ['./detailed-scss.component.scss']
})
export class DetailedScssComponent implements OnInit {
  isLoading = false;
  data;
  bankList:any = [];

  constructor(private subInjectService: SubscriptionInject,  private enumService: EnumServiceService) {
  }

  clientFamilybankList:any = [];
  ngOnInit() {
    this.bankList = this.enumService.getBank();
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log(this.bankList, 'this.bankList', this.clientFamilybankList);
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }
}
