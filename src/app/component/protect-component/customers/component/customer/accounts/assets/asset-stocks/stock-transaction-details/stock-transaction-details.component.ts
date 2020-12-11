import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';

@Component({
  selector: 'app-stock-transaction-details',
  templateUrl: './stock-transaction-details.component.html',
  styleUrls: ['./stock-transaction-details.component.scss']
})
export class StockTransactionDetailsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = [];
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
    console.log('bank', this.clientFamilybankList);
    console.log(this.data, "data 123 test");
    this.dataSource = this.data.transactionOrHoldingSummaryList;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Buy', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020' },
  { position: 'Sell', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020' },
  { position: 'Bonus', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020' },
  { position: 'Dividend', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020' },
];