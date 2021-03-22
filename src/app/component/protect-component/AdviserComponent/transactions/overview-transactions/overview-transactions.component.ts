import { UtilService } from '../../../../../services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { Component, OnInit } from '@angular/core';
import { OnlineTransactionComponent } from './doTransaction/online-transaction/online-transaction.component';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';
import { KnowYourCustomerComponent } from './know-your-customer/know-your-customer.component';
import { IinUccCreationComponent } from './IIN/UCC-Creation/iin-ucc-creation/iin-ucc-creation.component';
import { AddMandateComponent } from './MandateCreation/add-mandate/add-mandate.component';
import { HttpService } from 'src/app/http-service/http-service';
import { TransactionMobileViewComponent } from '../transaction-mobile-view/transaction-mobile-view.component';
import { MatDialog } from '@angular/material';
import { OnlineTransactionService } from '../online-transaction.service';
import { TransactionDetailComponent } from '../transactions-list/transaction-detail/transaction-detail.component';
import { TransactionEnumService } from '../transaction-enum.service';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { TransactionRoleService } from "../transaction-role.service";
import { DashboardService } from '../../dashboard/dashboard.service';
import { CredentialsErrorPopupComponent } from 'src/app/common/credentials-error-popup/credentials-error-popup.component';
import { AddNewAllKycComponent } from '../kyc-transactions/add-new-all-kyc/add-new-all-kyc.component';

@Component({
  selector: 'app-overview-transactions',
  templateUrl: './overview-transactions.component.html',
  styleUrls: ['./overview-transactions.component.scss']
})
export class OverviewTransactionsComponent implements OnInit {
  file: void;
  advisorId: any;
  finalStartDate: any;
  finalEndDate: any;
  errMessage: any;
  transactionCount: any;
  totalUccCount: any;
  totalInvestorWithoutMandate: any;
  isLoading = false;
  pendingCount: any;
  rejectCount: any;
  acceptCount: any;
  pendingTransaction: any;
  rejectionTransaction: any;
  doneTrasaction: any;
  percentageTrasact: any;
  transactionList: any;
  totalRejected: any;
  totalClientCode: any;
  totalClient: any;
  totalPending: any;
  totalPendingClient: any;
  isLoadingIIN: boolean = false;
  isLoadingMandate: boolean = false;
  hours: number;
  metrixLoader: boolean;
  kycDetails: any;
  kycDonePercentage: any;
  clientWithoutKycPercentage: any;


  constructor(public dialog: MatDialog, private subInjectService: SubscriptionInject,
    public eventService: EventService, private http: HttpService,
    private tranService: OnlineTransactionService, public enumDataService: EnumDataService,
    public transactionRoleServcie: TransactionRoleService) {
    this.advisorId = AuthService.getAdvisorId();
  }

  ngOnInit() {
    this.enumDataService.setBankAccountTypes();
    this.finalStartDate = UtilService.getStartOfTheDay(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7)).getTime();
    this.finalEndDate = UtilService.getEndOfDay(new Date()).getTime();
    this.getKycDashboardMetrix();
    this.getAllTransactionList();
    this.getMandate();
    this.getIInData();
    this.autoRemapClient();
    if (AuthService.getInvalidCredsTimeZone()) {
      this.hours = new Date().getHours() - new Date(AuthService.getInvalidCredsTimeZone()).getHours();
      if (this.hours > 4) {
        sessionStorage.removeItem('invalidPopup');
        this.hours = undefined
      }
    }
    // this.updateAllNseClients();
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

  openMobileErrorCopyTransactionPopup() {
    const dialogRef = this.dialog.open(TransactionMobileViewComponent, {

      maxWidth: '100vw',
      width: '90%',
      // panelClass: 'custom-modalbox-error'
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getKycDashboardMetrix() {
    this.metrixLoader = true;
    const obj = {
      advisorId: this.advisorId
    }
    this.tranService.getKycTransactionDashboardMetrix(obj).subscribe(
      data => {
        this.metrixLoader = false;
        if (data) {
          this.kycDonePercentage = ((data.kycVerifiedCount / data.totalCount) * 100);
          this.kycDonePercentage = (this.kycDonePercentage).toFixed(2);
          this.clientWithoutKycPercentage = ((data.kycUnverifiedCount / data.totalCount) * 100);
          this.clientWithoutKycPercentage = (this.clientWithoutKycPercentage).toFixed(2);
          this.kycDetails = data;
        }
      }
    )
  }

  openTransactionHistory(data) {
    const fragmentData = {
      flag: 'addNewTransaction',
      data,
      state: 'open35',
      componentName: TransactionDetailComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  openNewTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: null,
      id: 1,
      state: 'open65',
      componentName: OnlineTransactionComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getAllTransactionList();
            this.transactionList = undefined;
            DashboardService.dashLast7DaysTransactionStatus = null;
          }
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }


  openNewCustomer() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: KnowYourCustomerComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList()
          DashboardService.dashLast7DaysTransactionStatus = null;
          subscription.unsubscribe();
        }
      }
    );

  }

  openMandate(data) {
    const fragmentData = {
      flag: 'mandate',
      data,
      id: 1,
      state: 'open',
      componentName: AddMandateComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {

        if (UtilService.isRefreshRequired(sideBarData)) {
          DashboardService.dashLast7DaysTransactionStatus = null;
        }
        rightSideDataSub.unsubscribe();
      }
    );
  }

  getKycDetails() {

  }

  getAllTransactionList() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: null,
      startDate: this.finalStartDate,
      endDate: this.finalEndDate
    };
    this.tranService.getSearchScheme(obj).subscribe(
      data => {
        this.isLoading = false;
        this.transactionList = data;
        this.transactionList = TransactionEnumService.setPlatformEnum(data);
        this.transactionList = TransactionEnumService.setTransactionStatus(data);
        this.transactionCount = data.length;
        this.pendingTransaction = data.filter(data => data.status == 2);
        this.rejectionTransaction = data.filter(data => data.status == 7);
        this.doneTrasaction = data.filter(data => data.status == 6 || data.status == 8);
        this.doneTrasaction = this.doneTrasaction.length;
        if (this.doneTrasaction == undefined) {
          this.doneTrasaction = [];
        } else {
          this.percentageTrasact = ((this.doneTrasaction / this.transactionCount) * 100);
          this.percentageTrasact = (this.percentageTrasact).toFixed(2);
        }
        this.pendingTransaction = this.pendingTransaction.length;
        this.rejectionTransaction = this.rejectionTransaction.length;

      },
      err => {
        if (err === "Something went wrong !") {
          this.eventService.openSnackBar(err, 'Dismefault/stockfeediss');
        } else {
          if (AuthService.getInvalidCredsTimeZone() && this.hours > 4) {
            this.openCredentialsErrorPopup();
          }
          if (!AuthService.getInvalidCredsTimeZone() && !this.hours) {
            this.openCredentialsErrorPopup();
          }
        }
      }
      // this.eventService.openSnackBar(err, 'Dismefault/stockfeediss');
      //  this.errMessage = err.error.message;
    );
  }

  openCredentialsErrorPopup() {
    const dialogRef = this.dialog.open(CredentialsErrorPopupComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  getMandate() {
    this.isLoadingMandate = true;
    const obj = {
      advisorId: this.advisorId,
    };
    this.tranService.getOverviewMandate(obj).subscribe(
      data => {
        this.isLoadingMandate = false;
        this.totalInvestorWithoutMandate = data.totalInvestorWithoutMandate;
        data.statusList.forEach(element => {
          if (element.status == 1) {
            this.pendingCount = element.count;
          } else if (element.status == 2) {
            this.acceptCount = element.count;
          } else if (element.status == 3) {
            this.rejectCount = element.count;
          }
        });
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.errMessage = err.error.message;
      }
    );
  }


  autoRemapClient() {
    const obj = {
      advisorId: AuthService.getAdminId(),
    };
    this.tranService.autoRemapClientsToClientCode(obj).subscribe(
      data => {
      },
      err => {
      }
    );
  }

  //     totalInvestorWithoutMandate: 589
  // statusList: Array(4)
  // 0: {count: 4, status: 0}
  // 1: {count: 38, status: 1}
  // 2: {count: 1, status: 2}
  // 3: {count: 1, status: 3}
  //   }
  getIInData() {
    this.isLoadingIIN = true;
    const obj = {
      advisorId: this.advisorId,
    };
    this.tranService.getIINUCCOverview(obj).subscribe(
      data => {
        this.isLoadingIIN = false;
        this.totalUccCount = data.length;
        this.totalPending = data.totalPending;
        this.totalClient = data.totalClient;
        this.totalClientCode = data.totalClientCode;
        this.totalPendingClient = data.totalPendingClient;
        this.totalRejected = data.totalRejected;
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismiss');
        // this.errMessage = err.error.message;
      }
    );
  }

  openNewCustomerIIN() {
    const fragmentData = {
      flag: 'addNewCustomer',
      id: 1,
      direction: 'top',
      componentName: IinUccCreationComponent,
      state: 'open'
    };
    // this.router.navigate(['/subscription-upper'])
    AuthService.setSubscriptionUpperSliderData(fragmentData);
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );

  }

  openAddAllkyc(data, flag) {
    data['btnFlag'] = 'Cancel';
    const fragmentData = {
      flag,
      data,
      id: 1,
      state: 'open50',
      componentName: AddNewAllKycComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            // this.getBSECredentials();
            // data ? data.kycComplaint = 2 : '';
          }
          rightSideDataSub.unsubscribe();
        }

      }
    );
  }
}
