import { AuthService } from './../../../../../../auth-service/authService';
import { Component, OnInit, Input } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MFSchemeLevelHoldingsComponent } from '../../customer/accounts/assets/mutual-fund/mutual-fund/mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MatTableDataSource } from '@angular/material';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { MfServiceService } from '../../customer/accounts/assets/mutual-fund/mf-service.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['srno', 'type', 'date', 'amt', 'nav', 'unit', 'bunit', 'days', 'icons'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @Input() data;
  transactionTypeList = [];
  advisorId = AuthService.getAdvisorId();
  clientId = 15545;
  investorName: any;

  constructor(
    private UtilService: UtilService,
    private subInjectService: SubscriptionInject,
    private cusService: CustomerService,
    private eventService: EventService,
    private mfService: MfServiceService
  ) { }

  currentValue;
  profitOrLossValue;
  xirrValue;
  folioNumber;

  mutualFundTransactions = [];

  ngOnInit() {
    console.log("this is data what we got::", this.data);
    this.currentValue = this.data.currentValue;
    this.profitOrLossValue = this.currentValue - this.data.amountInvested;
    this.xirrValue = this.data.xirr;
    this.investorName = this.data.ownerName;
    this.folioNumber = this.data.folioNumber;
    this.initPoint();
    this.getTransactionTypeList()
  }

  getTransactionTypeList() {
    this.cusService.getTransactionTypeData({})
      .subscribe(res => {
        if (res) {
          this.transactionTypeList = res;
        }
      })
  }

  initPoint() {
    this.dataSource.data = this.data.mutualFundTransactions;
    this.mutualFundTransactions = this.data.mutualFundTransactions;
  }

  getTransactionTypeName(id) {
    return this.transactionTypeList.find(c => c.id === id).transactionType;
  }

  openMutualFund(flag, element) {
    let fragmentData;
    if (flag === 'editTransaction') {
      this.data.mutualFundTransactions = this.mutualFundTransactions.filter(item => item.id === element.id);
      element.flag = 'editTransaction';
      fragmentData = {
        flag,
        data: { flag, ...this.data, ...element },
        id: 1,
        state: 'open',
        componentName: MFSchemeLevelHoldingsComponent
      }
    } else if (flag === 'addTransaction') {
      fragmentData = {
        flag,
        data: { ...this.data, flag, ...element },
        id: 1,
        state: 'open',
        componentName: MFSchemeLevelHoldingsComponent
      };
    }
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // after closing code here...
            //  mutualfund get call  
            this.cusService.getMutualFund({ advisorId: this.advisorId, clientId: this.clientId })
              .subscribe(res => {
                if (res) {
                  console.log("again re hitting mutual fund get:::", res)
                }
              });
          }
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  deleteTransaction(element) {
    let requestJsonObj;
    const data = {
      id: element.id,
      unit: element.unit,
      effect: element.effect,
      mutualFundId: this.data.id
    };
    requestJsonObj = {
      freezeDate: element.freezeDate ? element.freezeDate : null,
      mutualFundTransactions: [data]
    }

    this.cusService.postDeleteTransactionMutualFund(requestJsonObj)
      .subscribe(res => {
        if (res) {
          console.log("success::", res);
          this.eventService.openSnackBar("Deletion Completed", "Dismiss")
        } else {
          this.eventService.openSnackBar("Deletion Failed", "Dismiss")
        }
      })
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