import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../subscription-inject.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionService } from '../../subscription.service';
import { AuthService } from "../../../../../../auth-service/authService";
import { UtilService } from 'src/app/services/util.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from 'saturn-datepicker';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CommonFroalaComponent } from '../common-subscription-component/common-froala/common-froala.component';

export interface PeriodicElement {
  name: string;
  docname: string;
  plan: string;
  servicename: string;
  cdate: string;
  sdate: string;
  clientsign: string;
  status: string;
  documentText: string;
}

@Component({
  selector: 'app-documents-subscriptions',
  templateUrl: './documents-subscriptions.component.html',
  styleUrls: ['./documents-subscriptions.component.scss'],
  providers: [[DatePipe], { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class DocumentsSubscriptionsComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  displayedColumns: string[] = ['name', 'docname', 'plan', 'servicename', 'cdate', 'sdate', 'clientsign', 'status', 'icons'];

  advisorId;
  isLoading = false;
  noData: string;
  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  chips = [
    { name: 'LIVE', value: 1 },
    { name: 'PAID', value: 2 },
    { name: 'OVERDUE', value: 3 }
  ];
  dateChips = [
    { name: 'Created date', value: 1 },
    { name: 'Sent date', value: 2 },
    { name: 'Client Signitature', value: 3 }
  ];
  selectedDateRange: { begin: Date; end: Date; };
  selectedStatusFilter: any;
  showFilter = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  private clientId: any;
  constructor(public subInjectService: SubscriptionInject, public dialog: MatDialog, public eventService: EventService,
    public subscription: SubscriptionService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.getdocumentSubData();
  }
  Open(value, data) {
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    fragmentData.data.isDocument = true;
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ');
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
    console.log('this.filterStatus: ', this.filterStatus);
    console.log('this.filterDate: ', this.filterDate);
  }
  orgValueChange(selectedDateRange) {
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);
    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate)
    this.selectedDateRange = { begin: selectedDateRange.begin, end: selectedDateRange.end };
  }
  getdocumentSubData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      flag: 4,
      limit: 10,
      offset: 0,
      dateType: 0,
      fromDate: '2019-01-01',
      toDate: '2019-11-01',
      statusIdList: '[0,1]',
    };
    this.subscription.getDocumentData(obj).subscribe(
      data => this.getdocumentResponseData(data)
    );
  }
  addFilters(addFilters) {
    console.log('addFilters', addFilters);
    if (!_.includes(this.filterStatus, addFilters)) {
      this.filterStatus.push(addFilters);
    } else {
      // _.remove(this.filterStatus, this.senddataTo);
    }
  }

  filterSubscriptionRes(data) {


    console.log('filterSubscriptionRes', data);
    this.dataSource.data = data;
    // this.getSubSummaryRes(data);
  }

  addFiltersDate(dateFilter) {
    console.log('addFilters', dateFilter);
    if (this.filterDate.length >= 1) {
      this.filterDate = []
    }
    this.filterDate.push((dateFilter == "1: Object") ? 1 : (dateFilter == "2: Object") ? 2 : 3);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
  }

  removeDate(item) {
    this.filterDate.splice(item, 1);
  }

  remove(item) {
    this.filterStatus.splice(item, 1);
  }

  getdocumentResponseData(data) {
    this.isLoading = false;

    if (data == undefined) {
      this.dataSource.data = [];
      this.noData = "No Data Found";
    } else {
      console.log(data);
      data.forEach(singleData => {
        singleData.documentText = singleData.docText;
      });
      // this.dataSource = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
    }
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }
}
