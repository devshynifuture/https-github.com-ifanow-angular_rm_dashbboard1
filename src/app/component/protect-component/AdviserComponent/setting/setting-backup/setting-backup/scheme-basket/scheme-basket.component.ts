import {Component, OnInit} from '@angular/core';
import {SettingSchemeDetailsComponent} from '../../../setting-entry/setting-scheme-details/setting-scheme-details.component';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from '../../../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-scheme-basket',
  templateUrl: './scheme-basket.component.html',
  styleUrls: ['./scheme-basket.component.scss']
})
export class SchemeBasketComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'ldate', 'rdate', 'status', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor(private subInjectService: SubscriptionInject) {
  }

  isLoading = false;
  ngOnInit() {
  }



  openSchemeDetails(value, data) {
    let popupHeaderText = !!data ? 'Edit Fixed deposit' : 'Add Fixed deposit';
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: SettingSchemeDetailsComponent,
      popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getFixedDepositList();
            // console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  ldate: string;
  rdate: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth 1', name: 'Equity',
    weight: 'Equity - Large cap', symbol: '23/09/2019', ldate: '23/09/2019', rdate: '-', status: 'Recommended'
  },

];
