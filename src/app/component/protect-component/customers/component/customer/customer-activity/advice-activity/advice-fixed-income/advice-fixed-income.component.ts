import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { SelectAdviceComponent } from '../select-advice/select-advice.component';
import { FixedDepositComponent } from '../../../accounts/assets/fixedIncome/fixed-deposit/fixed-deposit.component';
import { RecuringDepositComponent } from '../../../accounts/assets/fixedIncome/recuring-deposit/recuring-deposit.component';
import { BondsComponent } from '../../../accounts/assets/fixedIncome/bonds/bonds.component';
import { ActiityService } from '../../actiity.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-advice-fixed-income',
  templateUrl: './advice-fixed-income.component.html',
  styleUrls: ['./advice-fixed-income.component.scss']
})

export class AdviceFixedIncomeComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'position', 'name', 'weight', 'symbol', 'advice', 'astatus', 'adate', 'icon'];
  dataSource3 = ELEMENT_DATA3;
  advisorId: any;
  clientId: any;
  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject, private utilService: UtilService, private activityService: ActiityService) { }
  allAdvice = false;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 7
    }
    // let obj1 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 13
    // }
    // let obj2 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 14
    // }
    // let obj3 = {
    //   advisorId: this.advisorId,
    //   clientId: this.clientId,
    //   assetCategory: 15
    // }
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
    // this.activityService.getAllAsset(obj1).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
    // this.activityService.getAllAsset(obj2).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
    // this.activityService.getAllAsset(obj3).subscribe(
    //   data => this.getAllSchemeResponse(data), (error) => {
    //   }
    // );
  }
  getAllSchemeResponse(data) {
    console.log('data', data)
    data.BONDS;
    data.FIXED_DEPOSIT;
    data.RECURRING_DEPOSIT;
  }
  openselectAdvice(data) {
    const fragmentData = {
      flag: 'openselectAdvice',
      data,
      componentName: SelectAdviceComponent,

      state: 'open65'
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
  openFixedDeposit(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: FixedDepositComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
        }

      }
    );
  }
  openRecurringDeposit(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: RecuringDepositComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
  openBond(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: BondsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}

export interface PeriodicElement3 {
  name: string;
  position: string;
  weight: number;
  symbol: string;
  advice: string;
  astatus: string;
  adate: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
  { position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
  { position: 'Rahul Jain', name: '35,000', weight: 23 / 12 / 2019, symbol: 'ICICI FD', advice: 'Continue holding till maturity', astatus: 'Given', adate: '23/12/2019' },
];