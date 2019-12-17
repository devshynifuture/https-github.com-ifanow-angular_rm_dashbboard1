import { Component, OnInit } from '@angular/core';
import { AddMutualFundComponent } from './add-mutual-fund/add-mutual-fund.component';
import { MFSchemeLevelHoldingsComponent } from './mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MFSchemeLevelTransactionsComponent } from './mfscheme-level-transactions/mfscheme-level-transactions.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-mutual-fund',
  templateUrl: './mutual-fund.component.html',
  styleUrls: ['./mutual-fund.component.scss']
})
export class MutualFundComponent implements OnInit {

  constructor(public subInjectService:SubscriptionInject,public UtilService:UtilService) { }
  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  dataSource = ELEMENT_DATA;

  displayedColumns1 = ['data', 'amts'];
  datasource1 = ELEMENT_DATA1;
  ngOnInit() {
  }
  openMutualFund(flag, data) {
    let component;
    switch (true) {
      case (flag == "addPortfolio"):
        component = AddMutualFundComponent;
        break;
      case (flag == "holding"):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent
    }
    const fragmentData = {
      flag: 'editMF',
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

}
export interface PeriodicElement {
  name: string;
  amt: string;
  value: string;
  abs: number;
  xirr: number;
  alloc: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  { name: 'ICICI Equity Fund Growth	', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
  { name: 'HDFC Top 200', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  { name: 'Total', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
];

export interface PeriodicElement1 {
  data: string;
  amts: string;
}
const ELEMENT_DATA1: PeriodicElement1[] = [
  { data: 'a. Investment', amts: '15,70,000' },
  { data: 'b. Switch In', amts: '2,28,580' },
  { data: 'c. Switch Out', amts: '2,28,580' },
  { data: 'd. Redemption', amts: '0' },
  { data: 'e. Dividend Payout', amts: '0' },
  { data: 'f. Net Investment (a+b-c-d-e)', amts: '2,28,580' },
  { data: 'g. Market Value', amts: '2,28,580' },
  { data: 'h. Net Gain (g-f)', amts: '2,28,580' },
  { data: 'i. Realized XIRR (All Transactions)', amts: '2.81 %' },

];

