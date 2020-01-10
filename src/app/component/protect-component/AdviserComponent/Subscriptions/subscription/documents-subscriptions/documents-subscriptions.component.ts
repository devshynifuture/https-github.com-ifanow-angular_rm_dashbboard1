import {Component, OnInit, ViewChild, Output } from '@angular/core';
import {SubscriptionInject} from '../../subscription-inject.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';

import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionService} from '../../subscription.service';
import {AuthService} from "../../../../../../auth-service/authService";
import {UtilService} from 'src/app/services/util.service';
import * as _ from 'lodash';
import {DatePipe} from '@angular/common';
import {MAT_DATE_FORMATS} from 'saturn-datepicker';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {CommonFroalaComponent} from '../common-subscription-component/common-froala/common-froala.component';
import { EventEmitter } from 'protractor';

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
  providers: [[DatePipe], {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ],
})
export class DocumentsSubscriptionsComponent implements OnInit {
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['checkbox', 'name', 'docname', 'plan', 'servicename', 'cdate', 'sdate', 'clientsign', 'status', 'icons'];

  advisorId;
  isLoading = false;
  noData: string;
  filterStatus = [];
  filterDate = [];
  statusIdList = [];

  lastFilterDataId:any;
  filterDataArr=[];
  statusIdLength:any;
  scrollCallData:boolean;
  selectedDateFilter:any = "dateFilter"
  selectedStatusFilter:any ="statusFilter"
  chips = [
    {name: 'NOT STARTED', value: 0},
    {name: 'READY TO SEND', value: 1},
    {name: 'SENT', value: 2},
    {name: 'ESIGNED', value: 3}
  ];
  dateChips = [
    {name: 'Created date', value: 1},
    {name: 'Sent date', value: 2},
    {name: 'Client Signitature', value: 3}
  ];
  selectedDateRange: { begin: Date; end: Date; };
  showFilter = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  maxDate = new Date();
  dataCount: number;
  private clientId: any;
  

  constructor(public subInjectService: SubscriptionInject, public dialog: MatDialog, public eventService: EventService,
              public subscription: SubscriptionService, private datePipe: DatePipe, private subService: SubscriptionService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.dataCount = 0;
    this.getdocumentSubData(false);
    this.getClientSubscriptionList();
  }

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      console.log('item item ', item);
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  selectAll(event) {
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        item.selected = event.checked;
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource != undefined) {
      return this.dataCount === this.dataSource.filteredData.length;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selectAll({checked: false}) : this.selectAll({checked: true});
  }

  openEsignDocument(element) {
    const data = {
      advisorId: this.advisorId,
      // clientData: this._clientData,
      templateType: 3, // 1-Invoice, 2 is for quotation, 3 is for esign, 4 is document
      documentList: []
    };
    if (element) {
      data.documentList.push(element);

    } else {


      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          data.documentList.push(singleElement);
        }
      });
    }
    this.openViewDocument('eSignDocument', data);
  }


  openViewDocument(value, data) {
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
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getdocumentSubData(false);
            console.log('this is sidebardata in subs subs 2: ');
            rightSideDataSub.unsubscribe();
          }
        }
    );
  }

  downloadEsign(element) {
    const obj = {
      id: element.id,
    };

    this.subscription.getEsignedDocument(obj).subscribe(
        data => this.downloadEsignResponseData(data),
        error => {
          console.log(error);
        }
    );
  }

  downloadEsignResponseData(data) {
    console.log(data, "downloadEsign 123");
    window.open(data.presginedUrl);
  }

  // openSendEmail() {
  //   const data = {
  //     advisorId: this.advisorId,
  //     clientData: this._clientData,
  //     templateType: 4, // 2 is for quotation
  //     documentList: []
  //   };
  //   this.dataSource.filteredData.forEach(singleElement => {
  //     if (singleElement.selected) {
  //       data.documentList.push(singleElement);
  //     }
  //   });
  //   this.open('email', data);
  // }

  // open(value, data) {

  //   // this.eventService.sliderData(value);
  //   // this.subInjectService.rightSliderData(state);
  //   // this.subInjectService.addSingleProfile(data);

  //   const fragmentData = {
  //     flag: value,
  //     data: data,
  //     id: 1,
  //     state: 'open',
  //     documentList: data
  //   };
  //   fragmentData.data.clientName = this._clientData.name;
  //   fragmentData.data.isDocument = true;
  //   const rightSideDataSub = this.subInjectService.changeUpperRightSliderState(fragmentData).subscribe(
  //     sideBarData => {
  //       if (UtilService.isDialogClose(sideBarData)) {
  //         rightSideDataSub.unsubscribe();
  //       }
  //     }
  //   );
  // }

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
    this.selectedDateRange = {begin: selectedDateRange.begin, end: selectedDateRange.end};
  }

  getdocumentSubData(scrollLoader) {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      flag: 3,
      limit: -1,
      offset: 0,
      dateType: 0,
      fromDate: '2019-01-01',
      toDate: '2019-11-01',
      statusIdList: '1,2',
    };
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.subscription.getDocumentData(obj).subscribe(
        data => this.getdocumentResponseData(data), (error) => {
          this.eventService.showErrorMessage(error);
          this.dataSource.data = [];
          this.isLoading = false;
        }
    );
  }

  getClientSubscriptionList() {
    const obj = {
      id: this.advisorId
    };
    this.isLoading = true;
    this.subService.getSubscriptionClientsList(obj).subscribe(
      (data) =>{
        console.log(data, "clientdata");
        
      }, (error) => {
        this.eventService.openSnackBar('Somthing went worng!', 'dismiss');
      }
    );
  }  

  addFilters(addFilters) {

    console.log('addFilters', addFilters);
    if (!_.includes(this.filterStatus, addFilters)) {
      this.lastFilterDataId = 0;
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
      console.log(this.filterStatus);
    } else {
      this.lastFilterDataId = 0;
      // _.remove(this.filterStatus, this.senddataTo);
    }

    console.log(this.filterStatus, "this.filterStatus 123");

    this.callFilter(false);
  }


  

  addFiltersDate(dateFilter) {
    this.filterDate = [];
    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDataArr = [];
    this.lastFilterDataId = 0;
    this.filterDate.push((dateFilter == '1: Object') ? 1 : (dateFilter == '2: Object') ? 2 : 3);
    console.log('addFilters', dateFilter);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
    console.log(this.filterDate, "this.filterDate 123");
    this.callFilter(false);
  }

 
  removeDate(item) {
    console.log(this.filterDate, "this.filterDate 123 r");
    this.selectedDateFilter = "dateFilter"
    this.filterDate.splice(item, 1);
    this.lastFilterDataId = 0;
    this.callFilter(false);
  }

  remove(item) {
    if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
      this.selectedStatusFilter = "statusFilter";
    }

    this.filterStatus.splice(item, 1);
    this.filterDataArr = this.filterDataArr.filter((x) => { x.status != item.value })
    this.lastFilterDataId = 0;
    this.callFilter(false);

  }

  callFilter(scrollLoader) {
    if (this.filterStatus && this.filterStatus.length > 0) {
      this.statusIdList = [];
      this.dataSource.data = [{}, {}, {}]
      this.isLoading = true;
      this.filterStatus.forEach(singleFilter => {
        this.statusIdList.push(singleFilter.value);
        console.log(this.statusIdList, "this.statusIdList 1233");
      });
    } else {
      this.statusIdList = [];
    }
    // this.statusIdList = (this.sendData == undefined) ? [] : this.sendData;
    console.log(this.lastFilterDataId, this.statusIdLength < this.statusIdList.length, "aaaa");
    const obj = {
      advisorId: this.advisorId,
      limit: 10,
      offset: this.lastFilterDataId,
      fromDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.begin, 'yyyy-MM-dd') : null,
      toDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') : null,
      statusIdList: this.statusIdList,
      dateType: (this.filterDate.length == 0) ? 0 : this.filterDate,
    };
    console.log('this.callFilter req obj : ', obj, this.statusIdList);
    if (obj.statusIdList.length == 0 && obj.fromDate == null) {
      this.getdocumentSubData(false);
    } else {
      this.subService.filterSubscription(obj).subscribe(
        (data) => {
          this.filterSubscriptionRes(data, scrollLoader)
        }
      );
    }
  }

  filterSubscriptionRes(data, scrollLoader) {
    this.isLoading = false;

    console.log('filterSubscriptionRes', data);
    if (data == undefined && this.statusIdLength < 1) {
      this.noData = 'No Data Found';
      if (!scrollLoader) {
        this.dataSource.data = [];
      }
      else {
        this.dataSource.data = this.filterDataArr;
      }
    } else {
      console.log(this.statusIdList.length, this.statusIdLength < this.statusIdList.length, this.statusIdLength, "this.statusIdList.length123");
      // if(this.statusIdLength < this.statusIdList.length || this.statusIdList.length <= 0){
      //   this.statusIdLength = this.statusIdList.length;
      //   this.lastFilterDataId = 0;
      // }else{

      this.lastFilterDataId = data[data.length - 1].id;
      // }
      console.log(this.lastFilterDataId, "this.lastFilterDataId");
      if (this.filterDataArr.length <= 0) {
        this.filterDataArr = data;
      }
      else {
        this.filterDataArr = this.filterDataArr.concat(data);
        console.log(this.filterDataArr, "this.filterDataArr 123");
      }
      this.scrollCallData = true;

      this.dataSource.data = this.filterDataArr;
    }
    // this.getSubSummaryRes(data);
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

  // @Output() valueChange = new EventEmitter();
  deleteModal(data) {
    let list = [];
    if(data == null){
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          list.push(singleElement.documentRepositoryId);
        }
      });
    }
    else{
      [data.documentRepositoryId]
    }
    const dialogData = {
      data: 'DOCUMENT',
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteSettingsDocument(list).subscribe(
          data => {
            this.eventService.openSnackBar('document is deleted', 'dismiss');
            // this.valueChange.emit('close');
            dialogRef.close();
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined){
        this.getdocumentSubData(false);
      }
    });

  }
}
