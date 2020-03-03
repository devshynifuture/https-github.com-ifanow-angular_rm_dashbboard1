import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionsHistoryComponent } from './transactions-history/transactions-history.component';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from '../../Subscriptions/subscription-inject.service';
import { OnlineTransactionService } from '../online-transaction.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { TransactionEnumService } from '../transaction-enum.service';
import { OnlineTrasactionComponent } from '../overview-transactions/doTransaction/online-trasaction/online-trasaction.component';
import { MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'type', 'amount', 'order', 'status', 'icons'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  advisorId: any;
  selectedPreviousToShowDate;
  filterData: any;
  selectedBroker: any;
  seletedPreviousDate;
  finalStartDate;
  finalEndDate
  errMessage: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private onlineTransact: OnlineTransactionService, private eventService: EventService, private utilService: UtilService, private subInjectService: SubscriptionInject, private tranService: OnlineTransactionService) { }

  isLoading = false;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getFilterOptionData()
  }
  getFilterOptionData() {
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    let obj = {
      advisorId: this.advisorId,
      onlyBrokerCred: true
    }
    console.log('encode', obj)
    this.onlineTransact.getBSECredentials(obj).subscribe(
      data => this.getFilterOptionDataRes(data)
    );
  }
  getFilterOptionDataRes(data) {
    console.log(data);
    this.filterData = data;
    this.selectedBroker = data[0];
    this.selectedPreviousToShowDate = '7';
    this.finalStartDate = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 1).getTime();
    this.finalEndDate = new Date().getTime();
    this.getAllTransactionList();
  }
  getAllTransactionList() {
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    let obj =
    {
      "advisorId": this.advisorId,
      "tpUserCredentialId": this.selectedBroker.id,
      "startDate": this.finalStartDate,
      "endDate": this.finalEndDate
    }
    this.tranService.getSearchScheme(obj).subscribe(
      data => {
        console.log(data);
        this.isLoading = false;
        this.dataSource.data = TransactionEnumService.setPlatformEnum(data);
        this.dataSource.data = TransactionEnumService.setTransactionStatus(data)
        this.dataSource.sort = this.sort;
        console.log(this.dataSource.data)
      },
      err => {
        this.isLoading = false;
        this.errMessage=err.error.message;
      }
    )
  }
  Close(flag) {
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }
  sortDateFilter(data) {
    console.log(this.selectedPreviousToShowDate);
    this.finalStartDate = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * data.value).getTime();
    (data.value == 'custom') ? '' : this.getAllTransactionList();
  }
  startAndEndDateEvent(data) {
    this.finalStartDate = data.value.begin.getTime();
    this.finalEndDate = data.value.end.getTime();
    this.getAllTransactionList();
    console.log(data);
  }
  openTransactionHistory(data) {
    const fragmentData = {
      flag: 'addNewTransaction',
      data,
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
  openTransaction() {
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