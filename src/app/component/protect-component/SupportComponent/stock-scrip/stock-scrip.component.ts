import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../AdviserComponent/Subscriptions/subscription-inject.service';
import { AddStockScripComponent } from './stock-scrip/add-stock-scrip/add-stock-scrip.component';

@Component({
  selector: 'app-stock-scrip',
  templateUrl: './stock-scrip.component.html',
  styleUrls: ['./stock-scrip.component.scss']
})
export class StockScripComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  openOrderHistoricalFile(data) {
    const fragmentData = {
      flag: "addstockscrip",
      data,
      id: 1,
      state: "open50",
      componentName: AddStockScripComponent,
    };
    const rightSideDataSub = this.subInjectService
      .changeNewRightSliderState(fragmentData)
      .subscribe((sideBarData) => {
        console.log("this is sidebardata in subs subs : ", sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log("this is sidebardata in subs subs 2: ", sideBarData);
          rightSideDataSub.unsubscribe();
        }
      });
  }

}
