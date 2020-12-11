import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-stock-holding-details',
  templateUrl: './stock-holding-details.component.html',
  styleUrls: ['./stock-holding-details.component.scss']
})
export class StockHoldingDetailsComponent implements OnInit {

  data;

  constructor(private subInjectService: SubscriptionInject, private enumService: EnumServiceService, private enumDataService: EnumDataService) { }

  clientFamilybankList: any = [];
  bankDematList: any = [];
  ngOnInit() {
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    let obj = [{
      clientId: AuthService.getClientId(),
      userType: this.data.ownerList[0].isClient ? 2 : 3
    }]
    this.enumDataService.getDematDetail(obj).then((data) => {
      this.bankDematList = data;
    })
    console.log(this.bankDematList, 'bank', this.clientFamilybankList);
    console.log(this.data, "data 123 test");

  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
