import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AddEPSComponent } from '../../../accounts/assets/retirementAccounts/add-eps/add-eps.component';
import { AddSuperannuationComponent } from '../../../accounts/assets/retirementAccounts/add-superannuation/add-superannuation.component';
import { CashInHandComponent } from '../../../accounts/assets/cash&bank/cash-in-hand/cash-in-hand.component';
import { BankAccountsComponent } from '../../../accounts/assets/cash&bank/bank-accounts/bank-accounts.component';
import { AuthService } from 'src/app/auth-service/authService';
import { ActiityService } from '../../actiity.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { AdviceUtilsService } from '../advice-utils.service';

@Component({
  selector: 'app-advice-cash-and-hand',
  templateUrl: './advice-cash-and-hand.component.html',
  styleUrls: ['./advice-cash-and-hand.component.scss']
})
export class AdviceCashAndHandComponent implements OnInit {
  displayedColumns3: string[] = ['checkbox', 'name', 'desc', 'balance', 'advice', 'astatus', 'adate', 'icon'];
  advisorId: any;
  clientId: any;
  isLoading: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  bankAccDataSource: any = new MatTableDataSource();
  cashInHandDataSource: any = new MatTableDataSource();
  selectedAssetId: any = [];

  constructor(private utilService: UtilService, private subInjectService: SubscriptionInject, private activityService: ActiityService) { }

  ngOnInit() {
    // this.dataSource3.sort = this.sort;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getAdviceByAsset();
  }
  checkAll(flag, tableDataList) {
    console.log(flag, tableDataList)
    const { dataList, selectedIdList } = AdviceUtilsService.selectAll(flag, tableDataList._data._value, this.selectedAssetId);
    // this.dataSource = new MatTableDataSource(dataList);
    this.selectedAssetId = selectedIdList;
    console.log(this.selectedAssetId);
  }
  getAdviceByAsset() {
    let obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      assetCategory: 11
    }
    this.cashInHandDataSource.data = [{}, {}, {}];
    this.bankAccDataSource.data = [{}, {}, {}]
    this.isLoading = true;
    this.activityService.getAllAsset(obj).subscribe(
      data => this.getAllSchemeResponse(data), (error) => {
      }
    );
  }
  getAllSchemeResponse(data) {
    console.log(data);
    this.bankAccDataSource.data = data.BANK_ACCOUNTS;
    this.cashInHandDataSource.data = data.CASH_IN_HAND;
    this.bankAccDataSource['tableFlag'] = (data.BANK_ACCOUNTS.length == 0) ? false : true;
    this.cashInHandDataSource['tableFlag'] = (data.CASH_IN_HAND.length == 0) ? false : true;
    this.isLoading = false;
    // this.cashinHandData=data.CASH IN HAND;
  }
  allAdvice = false
  openCashAndBank(data, value) {
    const fragmentData = {
      flag: value,
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
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }

  openCashInHand(data, value) {
    const fragmentData = {
      flag: value,
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
            this.getAdviceByAsset();
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
}