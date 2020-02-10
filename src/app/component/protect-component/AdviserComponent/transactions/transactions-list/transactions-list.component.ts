import { Component, OnInit } from '@angular/core';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'type', 'units', 'order', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }


  openTransactionHistory() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open35',
      componentName: TransactionsHistoryComponent,
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
  position: string;
  weight: string;
  symbol: string;
  type: string;
  units: string;
  order: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain',
    symbol: 'Axis Liquid Fund -Regular Plan - Weekly Dividend Option', type: 'Purchase',
    units: '50,000', order: '23/01/2020', status: 'Pending authorisation'
  },
  {
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain',
    symbol: 'Axis Liquid Fund -Regular Plan - Weekly Dividend Option', type: 'Purchase',
    units: '50,000', order: '23/01/2020', status: 'Rejected'
  },
];