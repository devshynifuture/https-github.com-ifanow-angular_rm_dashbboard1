import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MFSchemeLevelHoldingsComponent } from '../../customer/accounts/assets/mutual-fund/mutual-fund/mfscheme-level-holdings/mfscheme-level-holdings.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['srno', 'type', 'date', 'amt', 'nav', 'unit', 'bunit', 'days', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor(private UtilService: UtilService , private subInjectService:SubscriptionInject) { }

  ngOnInit() {
  }
   openMutualFund(flag, data) {
    const fragmentData = {
      flag: 'editMF',
      data,
      id: 1,
      state: 'open',
      componentName: MFSchemeLevelHoldingsComponent
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
  srno: string;
  type: string;
  date: string;
  amt: string;
  nav: string;
  unit: string;
  bunit: string;
  days: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { srno: '1', type: 'Purchase', date: '14/05/2015', amt: '2,500', nav: '10.20', unit: '129.24', bunit: '129.24', days: '180' },
  { srno: '2', type: 'SIP', date: '14/05/2015', amt: '2,500', nav: '10.20', unit: '129.24', bunit: '129.24', days: '180' },
];