import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { SubscriptionInject } from '../../subscription-inject.service';
import { SubscriptionService } from '../../subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from '../../../../../../auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from 'saturn-datepicker';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { AddQuotationComponent } from '../common-subscription-component/add-quotation/add-quotation.component';
import { CommonFroalaComponent } from '../common-subscription-component/common-froala/common-froala.component';
import { AddQuotationSubscriptionComponent } from 'src/app/component/protect-component/customers/component/common-component/add-quotation-subscription/add-quotation-subscription.component';
import { ErrPageOpenComponent } from 'src/app/component/protect-component/customers/component/common-component/err-page-open/err-page-open.component';
import { SubscriptionDataService } from '../../subscription-data.service';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { SearchClientAddQuotationComponent } from './search-client-add-quotation/search-client-add-quotation.component';
import { RoleService } from 'src/app/auth-service/role.service';

export interface PeriodicElement {
  name: string;
  docname: string;
  plan: string;

  cdate: string;
  sdate: string;
  clientsign: string;
  status: string;
}

@Component({
  selector: 'app-quotations-subscription',
  templateUrl: './quotations-subscription.component.html',
  styleUrls: ['./quotations-subscription.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    // {
    //   provide: DateAdapter,
    //   useClass: MomentDateAdapter,
    //   deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    // },
    // { provide: MAT_DATE_LOCALE, useValue: 'en' },
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class QuotationsSubscriptionComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['checkbox', 'name', 'docname', 'plan', 'cdate', 'sdate', 'status', 'icons'];
  advisorId;
  maxDate = new Date();
  noData: string;
  isLoading = false;
  isFilter: boolean = false;

  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  filterDataArr = [];
  selectedStatusFilter: any = 'statusFilter';
  selectedDateFilter: any = 'dateFilter';
  lastFilterDataId;
  statusIdLength = 0;
  showFilter = false;
  selectedDateRange: { begin: Date; end: Date; };
  scrollLoad = false;
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  list: any[];


  getData: any = '';
  scrollCallData = true;
  scrollPosition;
  lastDataId;
  tableData = [];


  chips = [
    { name: 'LIVE', value: 1 },
    { name: 'PAID', value: 2 },
    { name: 'OVERDUE', value: 3 }
  ];
  dateChips = [
    { name: 'Created date', value: 1 },
    { name: 'Sent date', value: 2 },
    { name: 'Client consent', value: 3 }
  ];

  passFilterData = {
    data: "",
    selectedCount: "",
    statusFilter: this.chips,
    dateFilter: this.dateChips,
    filterQuotation: true
  };
  dataCount: number;
  clientList: any;


  constructor(public eventService: EventService, public subInjectService: SubscriptionInject,
    public dialog: MatDialog, private subService: SubscriptionService, private datePipe: DatePipe, private utilservice: UtilService,
    public roleService: RoleService) {
  }

  ngOnInit() {
    // this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    this.getQuotationRelatedClients();
    if (this.utilservice.checkSubscriptionastepData(5) == undefined) {
      this.dataSource.data = [{}, {}, {}]
    }
    else {
      (this.utilservice.checkSubscriptionastepData(5) == false) ? this.dataSource.data = [] : this.dataSource.data = [{}, {}, {}]
    }
    this.getClientSubData(this.scrollLoad);
    this.dataCount = 0;
  }
  getClientSubData(boolean) {
    this.dataSource.data = [{}, {}, {}]
    this.getQuotationsData(boolean).subscribe(
      data => {
        this.getQuotationsDataResponse(data)
      }, (error) => {
        this.errorMessage();
        // this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    )
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
        this.getQuotationsData(false).subscribe(
          data => {
            barButtonOption.active = false;
            this.getQuotationsDataResponse(data);
            this.eventService.changeUpperSliderState({ state: 'close' })
            // this.errorMessage();
          }, (error) => {
            barButtonOption.active = false;
            this.eventService.openSnackBar('Wait for sometime....', 'Dismiss');
          }
        )
      },
    }
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // subscription.unsubscribe();
        }
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

  scrollCall(scrollLoader) {
    const uisubs = document.getElementById('ui-subs');
    const wrapper = document.getElementById('wrapper');

    const contentheight = wrapper.offsetHeight;
    const yoffset = uisubs.scrollTop;
    const y = yoffset + window.innerHeight;

    if ((y >= contentheight && this.getData != undefined && this.scrollCallData)) {
      this.scrollCallData = false;
      if (this.scrollPosition == undefined) {
        this.scrollPosition = contentheight - yoffset;
      } else if (this.scrollPosition < contentheight) {
        this.scrollPosition = contentheight - window.innerHeight;
      }



      if (this.statusIdList.length <= 0) {

        this.getClientSubData(scrollLoader);
      } else {
        // this.callFilter(scrollLoader);
      }

    }
  }

  getFiterRes(data) {
    this.filterStatus = data.statusFilterJson;
    this.filterDate = data.dateFilterArr;
    this.selectedDateRange = data.dateFilterJson;
    this.lastFilterDataId = 0;
    this.filterDataArr = [];
    this.dataSource.data = [{}, {}, {}];
    this.isFilter = true;
    this.isLoading = true;
    this.getClientSubData(false);
  }

  orgValueChange(selectedDateRange) {

    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);
    this.selectedDateRange = { begin: selectedDateRange.begin, end: selectedDateRange.end };
    this.getClientSubData(false);
  }

  getQuotationsData(scrollLoader) {
    // this.dataSource.data = [{}, {}, {}];
    this.dataCount = 0;
    const obj = {
      // advisorId: 12345
      advisorId: this.advisorId,
      quotaionFlag: (this.filterDate.length == 0) ? 1 : 2,
      fromDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.begin, 'yyyy-MM-dd') : null,
      toDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') : null,
      dateType: (this.filterDate.length == 0) ? 0 : this.filterDate,
    };

    this.isLoading = true;
    // this.dataSource.data = [{}, {}, {}];
    return this.subService.getSubscriptionQuotationData(obj);
  }


  getQuotationsDataResponse(data) {
    this.isLoading = false;
    if (data && data.length > 0) {
      data.forEach(element => {
        element['sentDateInFormat'] = this.datePipe.transform((element.sentDate) ? element.sentDate : undefined, "dd/MM/yyyy");
      });
      this.data = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      //  this.noData = "No Data Found";
    } else {

      this.data = [];
      this.dataSource.data = data;
      this.dataSource.data = [];
      this.noData = 'No Data Found';

      // this.dataSource = data;
      // this.dataSource = new MatTableDataSource(data);
      // this.dataSource.sort = this.sort;
    }
  }

  deleteModal(deleteData) {
    this.list = [];
    if (deleteData == null) {
      this.dataSource.filteredData.forEach(singleElement => {
        if (singleElement.selected) {
          this.list.push(singleElement.id);
        }
      });
    } else {
      this.list = [deleteData.id];
    }
    const dialogData = {
      data: 'QUOTATION',
      header: 'DELETE',
      body: this.list.length == 1 ? 'Are you sure you want to delete the document?' : 'Are you sure you want to delete these documents?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subService.deleteClientDocumentsMultiple(this.list).subscribe(
          data => {
            this.eventService.openSnackBar('Document is deleted', 'Dismiss');
            // this.valueChange.emit('close');
            this.dataCount = 0;
            // this.getQuotationsData(null);
            this.getClientSubData(false);
            dialogRef.close(this.list);
            // this.getRealEstate();
          },
          error => this.eventService.showErrorMessage(error)
        );
      },
      negativeMethod: () => {
        this.list = [];
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.list.length > 0) {
        const tempList = [];
        this.dataSource.data.forEach(singleElement => {
          if (!singleElement.selected) {
            tempList.push(singleElement);
          }
        });
        this.dataSource.data = tempList;
      }
    });
  }

  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }
  }

  addFilters(addFilters) {
    // !_.includes(this.filterStatus, addFilters)
    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      this.filterStatus.push(addFilters);
      this.getClientSubData(false);
    } else {
      // _.remove(this.filterStatus, this.senddataTo);
    }
  }


  filterSubscriptionRes(data) {
    this.dataSource = data;
    // this.getSubSummaryRes(data);
  }

  addFiltersDate(dateFilter) {
    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDate.push(dateFilter.value);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };

    this.getClientSubData(false);
  }

  openPopup(data) {
    const Fragmentdata = {
      flag: data,
    };
    const dialogRef = this.dialog.open(AddQuotationComponent, {
      width: '50%',
      data: Fragmentdata,
      autoFocus: false,

    });
    dialogRef.afterClosed().subscribe(result => {


    });
  }

  removeDate(item) {
    this.filterDate.splice(item, 1);
    this.getClientSubData(false);

  }

  remove(item) {
    this.filterStatus.splice(item, 1);
  }
  getQuotationRelatedClients() {
    const obj = {
      advisorId: this.advisorId
    }
    this.subService.getClientListWithSubscription(obj).subscribe(
      data => {
        if (data) {
          this.clientList = data
        }
      }
    )
  }
  addQuotation(value) {
    const fragmentData = {
      flag: value,
      data: this.clientList,
      id: 1,
      state: 'open',
      componentName: SearchClientAddQuotationComponent
    };
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

  Open(value, data) {
    if (this.isLoading) {
      return;
    }
    data['isAdvisor'] = true;
    data['sendEsignFlag'] = false;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName: CommonFroalaComponent
    };
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

  // Open(value)
  // {
  //   this.subInjectService.rightSideData(value);
  // }
}
