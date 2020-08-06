import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
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

  constructor(private subInjectService: SubscriptionInject,private enumService: EnumServiceService) { }

  clientFamilybankList:any = [];
  ngOnInit() {
    this.clientFamilybankList = this.enumService.getclientFamilybankList();
    console.log('bank', this.clientFamilybankList);
    console.log(this.data, "data 123 test");
    this.dataSource = this.data.transactionOrHoldingSummaryList;
  }

  close() {
    this.subInjectService.changeNewRightSliderState({state: 'close'});
  }

}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Buy', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  {position: 'Sell', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  {position: 'Bonus', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
  {position: 'Dividend', name: '₹ 10,091', weight: '2,098', symbol: '22/06/2020'},
];