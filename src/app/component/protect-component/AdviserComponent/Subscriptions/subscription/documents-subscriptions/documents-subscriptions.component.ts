import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from '../../subscription-inject.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';

import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionService } from '../../subscription.service';
import { AuthService } from '../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from 'saturn-datepicker';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { CommonFroalaComponent } from '../common-subscription-component/common-froala/common-froala.component';
import { ErrPageOpenComponent } from 'src/app/component/protect-component/customers/component/common-component/err-page-open/err-page-open.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { RoleService } from 'src/app/auth-service/role.service';

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

  displayedColumns: string[] = ['checkbox', 'name', 'docname', 'plan', 'servicename', 'cdate', 'sdate', 'clientsign', 'status', 'icons'];

  advisorId;
  isLoading = false;
  noData: string;
  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  scrollLoad = false;
  lastFilterDataId: any;
  filterDataArr = [];
  statusIdLength: any = 0;
  scrollCallData: boolean;
  selectedDateFilter: any = 'dateFilter';
  selectedStatusFilter: any = 'statusFilter';
  chips = [
    { name: 'NOT STARTED', value: 0 },
    { name: 'READY TO SEND', value: 1 },
    { name: 'SENT', value: 2 },
    { name: 'ESIGNED', value: 3 }
  ];
  dateChips = [
    { name: 'Created date', value: 1 },
    { name: 'Sent date', value: 2 },
    { name: 'Client Signitature', value: 3 }
  ];

  passFilterData = {
    data: '',
    selectedCount: '',
    statusFilter: this.chips,
    dateFilter: this.dateChips
  };
  isFilter = false;
  selectedDateRange: { begin: Date; end: Date; };
  showFilter = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  maxDate = new Date();
  dataCount: number;
  private clientId: any;


  constructor(public subInjectService: SubscriptionInject, public dialog: MatDialog, public eventService: EventService,
    public subscription: SubscriptionService, private datePipe: DatePipe, private subService: SubscriptionService, private utilservice: UtilService,
    public roleService: RoleService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.dataCount = 0;
    if (this.utilservice.checkSubscriptionastepData(5) == undefined) {
      this.dataSource.data = [{}, {}, {}];
    } else {
      (this.utilservice.checkSubscriptionastepData(5) == false) ? this.dataSource.data = [] : this.dataSource.data = [{}, {}, {}];
    }
    this.getClientSubData(this.scrollLoad);
    this.getClientSubscriptionList();
  }

  getClientSubData(boolean) {
    this.dataSource.data = [{}, {}, {}];
    this.getdocumentSubData(boolean).subscribe(
      data => {
        this.getdocumentResponseData(data);
      }, (error) => {
        this.errorMessage();
        // this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  errorMessage() {
    const fragmentData = {
      flag: 'app-err-page-open',
      data: {},
      id: 1,
      // data,
      direction: 'top',
      componentName: ErrPageOpenComponent,
      state: 'open',
    };
    fragmentData.data = {
      positiveMethod: (barButtonOption: MatProgressButtonOptions) => {
        barButtonOption.active = true;
        this.getdocumentSubData(false).subscribe(
          data => {
            barButtonOption.active = false;
            this.getdocumentResponseData(data);
            this.eventService.changeUpperSliderState({ state: 'close' });
            // this.errorMessage();
          }, (error) => {
            barButtonOption.active = false;
            this.eventService.openSnackBar('Wait for sometime....', 'Dismiss');
          }
        );
      },
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // subscription.unsubscribe();
        }
      }
    );
  }

  selectAll(event) {
    // if(this.dataCount > 0 && this.dataCount != this.dataSource.data.length){
    //   this.dataSource.filteredData.forEach(item => {
    //     item.selected = event.undone;
    //   });
    //   this.dataCount = 0;
    // }else{
    this.dataCount = 0;
    if (this.dataSource != undefined) {
      this.dataSource.filteredData.forEach(item => {
        item.selected = event.checked;
        if (item.selected) {
          this.dataCount++;
        }
      });
    }
    // }
  }

  // /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   if (this.dataSource != undefined) {
  //     return this.dataCount === this.dataSource.filteredData.length;
  //   }
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selectAll({checked: false}) : this.selectAll({checked: true});
  // }

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

    if (this.roleService.subscriptionPermission.subModule.documents.documentsCapabilityList[1].enabledOrDisabled == 2) {
      return
    }
    data['sendEsignFlag'] = this.roleService.subscriptionPermission.subModule.clients.subModule.documentsCapabilityList[7].enabledOrDisabled == 1 ? true : false;;
    data['feeStructureFlag'] = data.documentText.includes('<service_fee>');
    data['isAdvisor'] = true;
    data['isEmail'] = this.roleService.subscriptionPermission.subModule.documents.documentsCapabilityList[3].enabledOrDisabled == 1 ? true : false;
    data['isDownload'] = this.roleService.subscriptionPermission.subModule.documents.documentsCapabilityList[4].enabledOrDisabled == 1 ? true : false;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
    const placeHolder = {
      advisorAddress: '',
      advisorName: '',
      clientAddress: '',
      clientName: fragmentData.data.clientName
    };
    fragmentData.data.documentText = this.utilservice.replacePlaceholder(fragmentData.data.documentText, placeHolder);
    fragmentData.data.isDocument = true;
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.getClientSubData(false);

          }
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
      }
    );
  }

  downloadEsignResponseData(data) {
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
  }

  orgValueChange(selectedDateRange) {
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);
    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);
    this.selectedDateRange = { begin: selectedDateRange.begin, end: selectedDateRange.end };
  }

  getdocumentSubData(scrollLoader) {
    const obj = {
      advisorId: this.advisorId,
      // clientId: this.clientId,
      flag: 3,
      limit: -1,
      offset: 0,
      dateType: 0,
      // fromDate: '2019-01-01',
      // toDate: '2019-11-01',
      // statusIdList: '1,2',
    };
    this.dataCount = 0;
    this.isLoading = true;
    // this.dataSource.data = [{}, {}, {}];
    return this.subscription.getDocumentData(obj);
  }

  getClientSubscriptionList() {
    const obj = {
      id: this.advisorId
    };
    this.isLoading = true;
    this.subService.getSubscriptionClientsList(obj).subscribe(
      (data) => {

      }, (error) => {
        this.eventService.openSnackBar('Something went wrong!', 'Dismiss');
      }
    );
  }

  getFiterRes(data) {
    this.filterStatus = data.statusFilterJson;
    this.filterDate = data.dateFilterArr;
    this.selectedDateRange = data.dateFilterJson;
    this.lastFilterDataId = 0;
    this.filterDataArr = [];
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.isFilter = true;
    this.callFilter(false);
  }

  // addFilters(addFilters) {

  //   // !_.includes(this.filterStatus, addFilters)
  //   if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
  //     this.lastFilterDataId = 0;
  //     this.filterStatus.push(addFilters);
  //     this.filterDataArr = [];
  //   } else {
  //     this.lastFilterDataId = 0;
  //     // _.remove(this.filterStatus, this.senddataTo);
  //   }


  //   this.callFilter(false);
  // }


  // addFiltersDate(dateFilter) {
  //   this.filterDate = [];
  //   if (this.filterDate.length >= 1) {
  //     this.filterDate = [];
  //   }
  //   this.filterDataArr = [];
  //   this.lastFilterDataId = 0;
  //   this.filterDate.push((dateFilter == '1: Object') ? 1 : (dateFilter == '2: Object') ? 2 : 3);
  //   const beginDate = new Date();
  //   beginDate.setMonth(beginDate.getMonth() - 1);
  //   UtilService.getStartOfTheDay(beginDate);

  //   const endDate = new Date();
  //   UtilService.getStartOfTheDay(endDate);

  //   this.selectedDateRange = { begin: beginDate, end: endDate };
  //   this.callFilter(false);
  // }


  // removeDate(item) {
  //   this.selectedDateFilter = 'dateFilter';
  //   this.filterDate.splice(item, 1);
  //   this.lastFilterDataId = 0;
  //   this.callFilter(false);
  // }

  // remove(item) {
  //   if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
  //     this.selectedStatusFilter = 'statusFilter';
  //   }

  //   this.filterStatus.splice(item, 1);
  //   this.filterDataArr = this.filterDataArr.filter((x) => {
  //     x.status != item.value;
  //   });
  //   this.lastFilterDataId = 0;
  //   this.callFilter(false);

  // }

  callFilter(scrollLoader) {
    this.dataCount = 0;
    if (this.filterStatus && this.filterStatus.length > 0) {
      this.statusIdList = [];
      this.dataSource.data = [{}, {}, {}];
      this.isLoading = true;
      this.filterStatus.forEach(singleFilter => {
        this.statusIdList.push(singleFilter.value);
      });
    } else {
      this.statusIdList = [];
    }
    // this.statusIdList = (this.sendData == undefined) ? [] : this.sendData;
    const obj = {
      advisorId: this.advisorId,
      limit: 10,
      offset: this.lastFilterDataId,
      fromDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.begin, 'yyyy-MM-dd') : null,
      toDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') : null,
      statusIdList: this.statusIdList,
      dateType: (this.filterDate.length == 0) ? 0 : this.filterDate,
    };
    if (obj.statusIdList.length == 0 && obj.fromDate == null) {
      this.getClientSubData(false);
    } else {
      this.subService.filterSubscription(obj).subscribe(
        (data) => {
          this.filterSubscriptionRes(data, scrollLoader);
        }
      );
    }
  }

  filterSubscriptionRes(data, scrollLoader) {
    this.isLoading = false;

    if (data == undefined && this.statusIdLength < 1) {
      this.noData = 'No Data Found';
      if (!scrollLoader) {
        this.dataSource.data = [];
      } else {
        this.dataSource.data = this.filterDataArr;
      }
    } else {
      // if(this.statusIdLength < this.statusIdList.length || this.statusIdList.length <= 0){
      //   this.statusIdLength = this.statusIdList.length;
      //   this.lastFilterDataId = 0;
      // }else{

      this.lastFilterDataId = data[data.length - 1].id;
      // }
      if (this.filterDataArr.length <= 0) {
        this.filterDataArr = data;
      } else {
        this.filterDataArr = this.filterDataArr.concat(data);
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
      this.noData = 'No Data Found';
    } else {
      data.forEach(singleData => {
        singleData['sentDateInFormat'] = this.datePipe.transform((singleData.sentDate) ? singleData.sentDate : undefined, "dd/MM/yyyy");
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
    if (data == null) {
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          list.push(singleElement.id);
        }
      });
    } else {
      list = [data.id];
    }
    const dialogData = {
      data: 'DOCUMENT',
      header: 'DELETE',
      body: list.length == 1 ? 'Are you sure you want to delete the document?' : 'Are you sure you want to delete these documents?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteClientDocumentsMultiple(list).subscribe(
          data => {
            this.eventService.openSnackBar('Document is deleted', 'Dismiss');
            // this.valueChange.emit('close');
            dialogRef.close(list);
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        const tempList = [];
        this.dataSource.data.forEach(singleElement => {
          if (result.length > 1) {
            if (!singleElement.selected) {
              tempList.push(singleElement);
            }
          } else {
            if (result[0] != singleElement.id) {
              tempList.push(singleElement);
            }
          }
        });
        this.dataSource.data = tempList;
      }
    });

  }
}
