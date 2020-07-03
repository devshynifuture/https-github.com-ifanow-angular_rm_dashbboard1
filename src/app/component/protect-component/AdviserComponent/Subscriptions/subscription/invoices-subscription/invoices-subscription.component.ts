import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SubscriptionService } from '../../subscription.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from '../../../../../../auth-service/authService';
import { UtilService, ValidatorType } from '../../../../../../services/util.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { ErrPageOpenComponent } from 'src/app/component/protect-component/customers/component/common-component/err-page-open/err-page-open.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EnumDataService } from 'src/app/services/enum-data.service';

export interface PeriodicElement {
  date: string;
  invoicenum: string;
  name: string;
  status: string;
  email: string;
  duedate: string;
  amt: string;
  balance: string;

}

@Component({
  selector: 'app-invoices-subscription',
  templateUrl: './invoices-subscription.component.html',
  styleUrls: ['./invoices-subscription.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class InvoicesSubscriptionComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  isFilter: boolean = false;
  chips = [
    { name: 'UNPAID', value: 0 },
    { name: 'PAID', value: 1 },
    { name: 'OVERDUE', value: 2 },
    { name: 'PARTIALLY PAID', value: 3 },
    { name: 'SENT', value: 4 },
    { name: 'VOID', value: 5 },
    { name: 'WRITEOFF', value: 6 }
  ];
  dateChips = [
    { name: 'Date', value: 1 },
    { name: 'Due date', value: 2 },
  ];
  invoiceDesign: string;
  noData: string;


  filterStatus = [];
  filterDate = [];
  statusIdList = [];
  filterDataArr = [];
  selectedStatusFilter: any = 'statusFilter';
  selectedDateFilter: any = 'dateFilter';
  lastFilterDataId;
  statusIdLength = 0;
  showFilter = false;
  scrollLoad = false;
  selectedDateRange: { begin: Date; end: Date; };

  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);
  list: any[];
  maxDate = new Date();
  numValidator = ValidatorType.NUMBER_ONLY;

  getData: any = '';
  scrollCallData = true;
  scrollPosition;
  lastDataId;
  tableData = [];
  passFilterData = {
    data: "",
    selectedCount: "",
    statusFilter: this.chips,
    dateFilter: this.dateChips
  };

  constructor(
    public dialog: MatDialog, 
    public subInjectService: SubscriptionInject, 
    private subService: SubscriptionService,
    private eventService: EventService, 
    public subscription: SubscriptionService, 
    private enumDataService: EnumDataService,
    private datePipe: DatePipe, private router: Router, private utilservice: UtilService) {
    // this.ngOnInit();
  }

  isLoading = false;
  subscriptionValue: any;
  invoiceSub: any;
  invoiceSubscription: string;
  invoiceClientData: any;
  dataCount: any;
  showEdit: boolean;
  showPdfInvoice;
  singleInvoiceData;
  // showLoader = true;
  advisorId;
  displayedColumns: string[] = ['checkbox', 'date', 'invoicenum', 'name', 'email', 'status', 'duedate', 'amt', 'balance'];
  @Input() invoiceValue;

  ngOnInit() {
    // this.dataSource = [{}, {}, {}];
    this.advisorId = AuthService.getAdvisorId();
    if (this.utilservice.checkSubscriptionastepData(6) == undefined) {
      this.dataSource.data = [{}, {}, {}]
    }
    else {
      (this.utilservice.checkSubscriptionastepData(6) == false) ? this.dataSource.data = [] : this.dataSource.data = [{}, {}, {}]
    }
    // (this.utilservice.checkSubscriptionastepData(6) == false) ? this.dataSource.data = [] : this.dataSource.data = [{}, {}, {}]
    this.getClientSubData(this.scrollLoad);
    this.showEdit = false;
    this.invoiceSubscription = 'false';
    this.invoiceDesign = 'true';
    this.dataCount = 0;

  }
  getClientSubData(boolean) {
    this.dataSource.data = [{}, {}, {}]
    this.getInvoiceSubData(boolean).subscribe(
      data => {
        this.getData = data;
        this.isLoading = false;

        if (data != undefined) {
          this.lastDataId = data[data.length - 1].id;
          this.tableData = data;
        } else {
        }
        this.getInvoiceResponseData(this.tableData);
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
        this.getInvoiceSubData(false).subscribe(
          data => {
            barButtonOption.active = false;
            this.getData = data;
            this.isLoading = false;

            if (data != undefined) {
              this.lastDataId = data[data.length - 1].id;
              this.tableData = data;
            } else {
            }
            this.getInvoiceResponseData(this.tableData);
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
        this.callFilter(scrollLoader);
      }

    }
  }

  getInvoiceSubData(scrollLoader) {
    const obj = {
      id: this.advisorId,
      // id: 2735, // pass here advisor id for Invoice advisor
      module: 1,

    };
    // this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.dataCount = 0;

    return this.subscription.getInvoices(obj);
  }

  addInvoice(edit) {

    this.invoiceSubscription = edit;
    // this.invoiceDesign = edit;
  }

  getInvoiceResponseData(data) {
    // this.isLoading = false;
    // if (data == undefined) {
    //   this.dataSource.data = [];
    //   this.noData = 'No Data Found';
    // } else {
    //   const ELEMENT_DATA = data;
    //   this.invoiceClientData = data;
    //   ELEMENT_DATA.forEach(item => item.selected = false);
    //   // this.dataSource = ELEMENT_DATA;
    //   this.dataSource.data = ELEMENT_DATA;
    //   this.dataSource.sort = this.sort;
    //   // this.showLoader = false;
    // }

    const uisubs = document.getElementById('ui-subs');
    this.isLoading = false;

    if (data && data.length > 0) {
      this.data = data;
      data.forEach(element => {
        element['dueDateShow'] = (element.dueDate) ? this.datePipe.transform(element.dueDate, 'dd/MM/yyyy') : 'N/A';
      });
      this.invoiceClientData = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      if (this.scrollPosition != undefined) {
        uisubs.scrollTo(0, this.scrollPosition);
      }

      this.scrollCallData = true;
      // this.DataToSend = data;
    } else {
      this.data = [];
      this.dataSource.data = data;
      this.dataSource.data = [];
      const ELEMENT_DATA = data;
      // this.invoiceClientData = data;
      ELEMENT_DATA.forEach(item => item.selected = false);
      // this.dataSource = ELEMENT_DATA;
      // this.dataSource.data = ELEMENT_DATA;
      this.noData = 'No Data Found';
    }
  }

  // showInvoicePdf(value)
  // {
  //  this.subscription.getSingleInvoiceData(value.id).subscribe(
  //    data=>this.getSingleResponseInvoicePdf(data)
  //  )
  // this.showPdfInvoice=true;
  // }
  openInvoice(data, value, state) {

    if (this.isLoading) {
      return;
    }
    this.invoiceSub = value;
    this.invoiceSubscription = 'true';
    this.eventService.sidebarData(value);
    this.subInjectService.addSingleProfile(data);
  }

  getSingleResponseInvoicePdf(data) {
    this.singleInvoiceData = data;
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

  changeSelect() {
    this.dataCount = 0;
    this.dataSource.filteredData.forEach(item => {
      if (item.selected) {
        this.dataCount++;
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   if (this.dataSource != undefined) {
  //     return this.dataCount === this.dataSource.filteredData.length;
  //   }
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selectAll({ checked: false }) : this.selectAll({ checked: true });
  // }

  display(data) {

    if (data.closingState) {
      this.dataSource.data = [{}, {}, {}]
      this.tableData = [];
      this.getClientSubData(false);
      this.dataCount = 0;
    }
    this.invoiceSubscription = 'false';
    this.subInjectService.addSingleProfile("");
    // this.ngOnInit();
  }
  getCancelInvoiceSubscription(data) {
    this.invoiceSubscription = 'false';
    if (data) {
      this.dataSource.data = [{}, {}, {}]
      this.tableData = [];
      this.getClientSubData(false);
      this.dataCount = 0;
    }
    // this.ngOnInit();
  }

  showFilters(showFilter) {
    if (showFilter == true) {
      this.showFilter = false;
    } else {
      this.showFilter = true;
    }

  }


  callFilter(scrollLoader) {
    this.dataCount = 0;
    if (this.filterStatus && this.filterStatus.length > 0) {
      this.dataSource.data = [{}, {}, {}]
      this.isLoading = true;
      this.statusIdList = [];
      this.filterStatus.forEach(singleFilter => {
        this.statusIdList.push(singleFilter.value);
      });
    } else {
      this.statusIdList = [];
    }
    // this.statusIdList = (this.sendData == undefined) ? [] : this.sendData;

    const obj = {
      Id: this.advisorId,
      limit: 10,
      module: 1,
      offset: this.lastFilterDataId,
      fromDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.begin, 'yyyy-MM-dd') : null,
      toDate: (this.filterDate.length > 0) ? this.datePipe.transform(this.selectedDateRange.end, 'yyyy-MM-dd') : null,
      statusIdList: this.statusIdList,
      dateType: (this.filterDate.length == 0) ? 0 : this.filterDate,
    };
    if (obj.statusIdList.length == 0 && obj.fromDate == null) {
      this.getClientSubData(false);
    } else {
      this.subService.filterInvoices(obj).subscribe(
        (data) => {
          this.filterSubscriptionRes(data, scrollLoader);
        }
      );
    }
  }


  filterSubscriptionRes(data, scrollLoader) {
    this.isLoading = false;

    if (data == undefined && this.statusIdLength < 1) {
      // this.noData = 'No Data Found';
      if (!scrollLoader) {
        this.dataSource.data = [];
      }
      else {
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
      }
      else {
        this.filterDataArr = this.filterDataArr.concat(data);
      }
      this.scrollCallData = true;

      this.dataSource.data = this.filterDataArr;
    }
    // this.getSubSummaryRes(data);
  }

  addFilters(addFilters) {

    // !_.includes(this.filterStatus, addFilters)
    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      this.lastFilterDataId = 0;
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
    } else {
      this.lastFilterDataId = 0;
      // _.remove(this.filterStatus, this.senddataTo);
    }


    this.callFilter(false);
  }


  addFiltersDate(dateFilter) {
    this.filterDate = [];
    this.dataSource.data = [{}, {}, {}]
    this.isLoading = true;
    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDataArr = [];
    this.lastFilterDataId = 0;
    this.filterDate.push((dateFilter == '1: Object') ? 1 : (dateFilter == '2: Object') ? 2 : 3);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
    this.callFilter(false);
  }

  removeDate(item) {
    this.dataSource.data = [{}, {}, {}];
    this.selectedDateFilter = 'dateFilter';
    this.filterDate.splice(item, 1);
    this.lastFilterDataId = 0;
    this.callFilter(false);
  }

  remove(item) {
    this.dataSource.data = [{}, {}, {}];
    if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
      this.selectedStatusFilter = 'statusFilter';
    }

    this.filterStatus.splice(item, 1);
    this.filterDataArr = this.filterDataArr.filter((x) => {
      x.status != item.value;
    });
    this.lastFilterDataId = 0;
    this.callFilter(false);

  }

  getFiterRes(data) {
    this.filterDataArr = [];
    this.filterStatus = data.statusFilterJson;
    this.filterDate = data.dateFilterArr;
    this.selectedDateRange = data.dateFilterJson;
    this.lastFilterDataId = 0;
    this.dataSource.data = [{}, {}, {}];
    this.isLoading = true;
    this.isFilter = true;
    this.callFilter(false);
  }

  formatter(data) {
    data = Math.round(data);
    return data;
  }

  deleteModal(value) {
    this.list = [];
    let listIndex = [];
    this.dataSource.filteredData.forEach(singleElement => {
      if (singleElement.selected) {
        listIndex.push(this.dataSource.filteredData.indexOf(singleElement));
        this.list.push(singleElement.id);
      }
    });
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subscription.deleteInvoices(this.list).subscribe(
          data => {
            this.dataCount = 0;
            this.eventService.openSnackBar('invoice deleted successfully.', 'Dismiss');
            dialogRef.close(this.list);

          },
          error => this.eventService.showErrorMessage(error)
        );
        dialogRef.close(listIndex);

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
        const tempList = []
        this.dataSource.data.forEach(singleElement => {
          if (!singleElement.selected) {
            tempList.push(singleElement);
          }
          singleElement.selected = false;
        });
        this.dataSource.data = tempList;
        this.dataCount = 0;
      }


    });
  }

  ngOnDestroy(){
    // dirty fix for resetting search data
    if (!this.enumDataService.searchData || this.enumDataService.searchData.length == 0) {
      this.enumDataService.searchClientList();
    }
  }
}
