import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddEPSComponent } from '../../../accounts/assets/retirementAccounts/add-eps/add-eps.component';
import { AddSuperannuationComponent } from '../../../accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { CashInHandComponent } from '../../../accounts/assets/cash&bank/cash-in-hand/cash-in-hand.component';
import { BankAccountsComponent } from '../../../accounts/assets/cash&bank/bank-accounts/bank-accounts.component';

@Component({
  selector: 'app-advice-cash-and-hand',
  templateUrl: './advice-cash-and-hand.component.html',
  styleUrls: ['./advice-cash-and-hand.component.scss']
})
export class AdviceCashAndHandComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'balance','advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA1;
  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, ) { }

  ngOnInit() {
  }
  openCashAndBank(data) {
    const fragmentData = {
      flag: '',
      data,
      id: 1,
      state: 'open',
      componentName: BankAccountsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getBankAccountList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openCashInHand(data) {
    const fragmentData = {
      flag: 'addCashInHand',
      data,
      id: 1,
      state: 'open',
      componentName: CashInHandComponent

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getCashInHandList();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}
export interface PeriodicElement1 {
  name: string;
  desc: string;
  balance: string;
  advice: string;
  adate: string;
  astatus: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Rahul Jain', desc: '1',balance:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },
  { name: 'Rahul Jain', desc: '2',balance:'20000', advice: 'do trasact', adate: '2020-02-20', astatus: 'LIVE' },

];