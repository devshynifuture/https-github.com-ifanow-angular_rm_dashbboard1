import { AuthService } from './../../../../../../auth-service/authService';
import { Component, OnInit, Input, NgModule, ViewChildren } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MFSchemeLevelHoldingsComponent } from '../../customer/accounts/assets/mutual-fund/mutual-fund/mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { CustomerService } from '../../customer/customer.service';
import { EventService } from '../../../../../../Data-service/event.service';
import { MfServiceService } from '../../customer/accounts/assets/mutual-fund/mf-service.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SkeletonLoadingDirective } from 'src/app/common/directives/skeleton-loading.directive';
import { FormatNumberDirective } from 'src/app/format-number.directive';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['srno', 'type', 'date', 'amt', 'nav', 'unit', 'bunit', 'days', 'icons'];
  dataSource = new MatTableDataSource();
  @Input() data;
  transactionTypeList = [];
  advisorId = AuthService.getAdvisorId();
  clientId = AuthService.getClientId();
  investorName: any;
  isLoading = false;
  mfList: any;

  constructor(
    private UtilService: UtilService,
    private subInjectService: SubscriptionInject,
    private cusService: CustomerService,
    private eventService: EventService,
    private mfService: MfServiceService,
    public dialog: MatDialog,
  ) { }

  currentValue;
  profitOrLossValue;
  xirrValue;
  folioNumber;

  mutualFundTransactions = [];
  @ViewChildren(FormatNumberDirective) formatNumber;

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
      if(this.mfList){
        this.data.mutualFundTransactions=this.mfList.mutualFundTransactions.filter(item => item.id === element.id);
      }else{
        this.data.mutualFundTransactions = this.mutualFundTransactions.filter(item => item.id === element.id);
      }
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
            this.isLoading = true;
            this.dataSource = new MatTableDataSource([{}, {}, {}]);
            this.cusService.getMutualFund({ advisorId: this.advisorId, clientId: this.clientId })
              .subscribe(res => {
                if (res) {
                  this.isLoading = false;
                  this.getTransactionDataBasedOnMf(res);
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
  getTransactionDataBasedOnMf(res) {
    this.isLoading = false;
    let filterData =this.mfService.doFiltering(res);
    this.mfList = filterData.mutualFundList;
    this.mfList = this.mfList.find((item: any) =>
    (item.id == this.data.id)
    );
    this.dataSource.data = this.mfList.mutualFundTransactions
  }
  // deleteTransaction(element) {
  //   let requestJsonObj;
  //   const data = {
  //     id: element.id,
  //     unit: element.unit,
  //     effect: element.effect,
  //     mutualFundId: this.data.id
  //   };
  //   requestJsonObj = {
  //     freezeDate: element.freezeDate ? element.freezeDate : null,
  //     mutualFundTransactions: [data]
  //   }

  //   this.cusService.postDeleteTransactionMutualFund(requestJsonObj)
  //     .subscribe(res => {
  //       if (res) {
  //         console.log("success::", res);
  //         this.eventService.openSnackBar("Deletion Completed", "Dismiss")
  //       } else {
  //         this.eventService.openSnackBar("Deletion Failed", "Dismiss")
  //       }
  //     })
  // }
  deleteTransaction(value, element) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
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
        this.isLoading = true;
        this.dataSource = new MatTableDataSource([{}, {}, {}]);
        dialogRef.close();
        this.cusService.postDeleteTransactionMutualFund(requestJsonObj)
          .subscribe(res => {
            if (res) {
              this.isLoading = true;
              this.eventService.openSnackBar('Deleted Successfully', "Dismiss");
              this.cusService.getMutualFund({ advisorId: this.advisorId, clientId: this.clientId })
                .subscribe(res => {
                  if (res) {
                    this.getTransactionDataBasedOnMf(res);
                    console.log("again re hitting mutual fund get:::", res)
                  }
                });
            }
          })


      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
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