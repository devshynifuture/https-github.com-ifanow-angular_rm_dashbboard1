import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddAssetStocksComponent } from './add-asset-stocks/add-asset-stocks.component';
import { StockScripLevelHoldingComponent } from './stock-scrip-level-holding/stock-scrip-level-holding.component';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-asset-stocks',
  templateUrl: './asset-stocks.component.html',
  styleUrls: ['./asset-stocks.component.scss']
})
export class AssetStocksComponent implements OnInit {
  displayedColumns25 = ['scrip', 'owner', 'bal', 'price', 'mprice', 'amt', 'cvalue', 'gain', 'ret', 'xirr', 'dividend', 'icons'];
  dataSource25 = ELEMENT_DATA25;
  advisorId: any;
  clientId: any;
  assetStocksdata: any;
  portfolioData: any;

  constructor(private subInjectService: SubscriptionInject, private cusService: CustomerService, private eventService: EventService) { }

  ngOnInit() {
    this.dataSource25 = ELEMENT_DATA25;
    console.log(this.dataSource25)
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getStocksData();
  }
  getStocksData() {
    const obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getAssetStockData(obj).subscribe(
      data => this.getStocksDataRes(data),
      err => this.eventService.openSnackBar(err)
    )
  }
  getStocksDataRes(data) {
    console.log(data)
    this.assetStocksdata = data;
    this.portfolioData = data.portfolios;
  }
  openAddStock(data) {
    const fragmentData = {
      flag: 'addStock',
      data,
      id: 1,
      state: 'open',
      componentName: AddAssetStocksComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getStocksData();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  openScriptLevelHolding(data) {
    const fragmentData = {
      flag: 'addScriptLevelHolding',
      data,
      id: 1,
      state: 'open70',
      componentName: StockScripLevelHoldingComponent
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


export interface PeriodicElement25 {
  scrip: string;
  owner: string;
  bal: string;
  price: string;
  mprice: string;
  amt: string;
  cvalue: string;
  gain: string;
  ret: string;
  xirr: string;
  dividend: string;
}
const ELEMENT_DATA25: PeriodicElement25[] = [

  {
    scrip: 'Bharat Forge Ltd',
    owner: 'Rahul Jain'
    ,
    bal: '94,925',
    price: '29.20',
    mprice: '33.67',
    amt: '94,925',
    cvalue: '1,23,925',
    gain: '29,230',
    ret: '12.98%',
    xirr: '9.08%',
    dividend: '-'
  },
  {
    scrip: 'V-Guard Industries Ltd',
    owner: 'Rahul Jain'
    ,
    bal: '94,925',
    price: '29.20',
    mprice: '33.67',
    amt: '94,925',
    cvalue: '1,23,925',
    gain: '29,230',
    ret: '12.98%',
    xirr: '9.08%',
    dividend: '201'
  },

];

