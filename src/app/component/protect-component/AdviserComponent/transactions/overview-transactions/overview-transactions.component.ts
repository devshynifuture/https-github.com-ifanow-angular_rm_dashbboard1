import { UtilService } from '../../../../../services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { TransactionAddComponent } from '../transaction-add/transaction-add.component';
import { OnlineTrasactionComponent } from './doTransaction/online-trasaction/online-trasaction.component';

@Component({
  selector: 'app-overview-transactions',
  templateUrl: './overview-transactions.component.html',
  styleUrls: ['./overview-transactions.component.scss']
})
export class OverviewTransactionsComponent implements OnInit {

  constructor(private subInjectService: SubscriptionInject) { }

  ngOnInit() {
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  openNewTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open65',
      componentName: OnlineTrasactionComponent,
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
