import {Component, OnInit, ViewChild} from '@angular/core';
import {TransactionsHistoryComponent} from './transactions-history/transactions-history.component';
import {UtilService} from 'src/app/services/util.service';
import {SubscriptionInject} from '../../Subscriptions/subscription-inject.service';
import {OnlineTransactionService} from '../online-transaction.service';
import {EventService} from 'src/app/Data-service/event.service';
import {AuthService} from 'src/app/auth-service/authService';
import {TransactionEnumService} from '../transaction-enum.service';
import {OnlineTransactionComponent} from '../overview-transactions/doTransaction/online-transaction/online-transaction.component';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  displayedColumns: string[] = ['platformName', 'transactionNumber', 'clientName', 'schemeName', 'type', 'amount', 'orderDate',
    'status', 'icons'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  selectedPreviousToShowDate;
  selectedBroker;
  finalStartDate;
  finalEndDate;
  errMessage: any;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  noData: string;
  maxDate = new Date();
  dontHide: boolean;
  credentialData = [{id: 0, brokerCode: 'ALL'}];
  isAdvisorSection = true;

  isLoading = false;

  constructor(private onlineTransact: OnlineTransactionService,
              private eventService: EventService, private utilService: UtilService,
              private subInjectService: SubscriptionInject,
              private tranService: OnlineTransactionService,
              private router: Router) {
  }

  ngOnInit() {
    const routeName = this.router.url.split('/')[1];
    if (routeName == 'customer') {
      this.isAdvisorSection = false;
    }
    this.selectedPreviousToShowDate = '7';
    this.finalStartDate = UtilService.getStartOfTheDay(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7)).getTime();
    this.finalEndDate = UtilService.getEndOfDay(new Date()).getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.selectedBroker = this.credentialData[0];
    if (this.isAdvisorSection) {
      this.getFilterOptionData();
    }

    this.refresh(false);
  }


  getFilterOptionData() {
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    };
    console.log('encode', obj);
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data), error => {
        this.isLoading = false;
        this.noData = 'No credentials found';
        this.eventService.openSnackBar(error, 'Dismiss');
        this.dataSource.data = [];
      }
    );
  }

  refresh(flag) {
    this.dontHide = true;
    this.getAllTransactionList();
  }

  getFilterOptionDataRes(data) {
    if (data) {
      this.isLoading = false;
      console.log(data);
      data.forEach(singleBroker => {
        this.credentialData.push(singleBroker);
      });
      console.log('this.credentialData ', this.credentialData);
      // this.selectedBroker = data[0];
      this.getAllTransactionList();
    } else {
      this.isLoading = false;
      this.noData = 'No credentials found';
      this.dataSource.data = [];
    }

  }

  getAllTransactionList() {
    this.dontHide = true;
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    const obj: any = {
      advisorId: this.advisorId,
      startDate: this.finalStartDate,
      endDate: this.finalEndDate
    };
    if (this.isAdvisorSection) {
      obj.tpUserCredentialId = this.selectedBroker.id;
      obj.brokerCode = this.selectedBroker.brokerCode == 'ALL' ? '' : this.selectedBroker.brokerCode;
      // obj.aggregatorType = this.selectedBroker.id;
    } else {
      obj.clientId = AuthService.getClientId();
    }
    console.log('getTransactionList request JSON : ', obj);
    this.tranService.getSearchScheme(obj).subscribe(
      data => {
        if (data) {
          this.dontHide = true;
          this.isLoading = false;
          this.dataSource.data = TransactionEnumService.setPlatformEnum(data);
          this.dataSource.data = TransactionEnumService.setTransactionStatus(data);
          this.dataSource.sort = this.sort;
          console.log(this.dataSource.data);
        } else {
          this.dontHide = true;
          this.isLoading = false;
          this.noData = 'No transactions found';
          // this.eventService.openSnackBar('no transaction found', 'Dismiss');
          this.dataSource.data = [];
        }
      },
      err => {

        this.isLoading = false;
        this.eventService.openSnackBar(err, 'Dismiss');
        this.dataSource.data = [];
        this.errMessage = err.error;
      }
    );
  }

  close(flag) {
    this.subInjectService.changeNewRightSliderState({state: 'close', refreshRequired: flag});
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  sortDateFilter(data) {
    console.log(this.selectedPreviousToShowDate);
    this.finalStartDate = UtilService.getStartOfTheDay(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * data.value)).getTime();
    this.finalEndDate = UtilService.getEndOfDay(new Date()).getTime();
    (data.value == 'custom') ? '' : this.refresh(true);
  }

  startAndEndDateEvent(data) {
    this.finalStartDate = UtilService.getStartOfTheDay(data.value.begin).getTime();
    this.finalEndDate = UtilService.getEndOfDay(data.value.end).getTime();
    this.refresh(true);
    console.log(data);
  }

  openTransactionHistory(data) {
    console.log('openTransactionHistory data: ', data);
    const fragmentData = {
      flag: 'addNewTransaction',
      data,
      state: 'open35',
      componentName: TransactionsHistoryComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  openTransaction() {
    const fragmentData = {
      flag: 'addNewTransaction',
      data: {isAdvisorSection: this.isAdvisorSection, flag: 'addNewTransaction'},
      id: 1,
      state: 'open65',
      componentName: OnlineTransactionComponent,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.refresh(true);
          }
          console.log('this is sidebardata transactions list in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
