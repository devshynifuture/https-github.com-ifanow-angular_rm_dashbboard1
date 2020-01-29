import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SubscriptionService } from '../../subscription.service';
import { SubscriptionInject } from '../../subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource, MAT_DATE_FORMATS } from '@angular/material';
import { AuthService } from '../../../../../../auth-service/authService';
import { UtilService, ValidatorType } from '../../../../../../services/util.service';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

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
export class InvoicesSubscriptionComponent implements OnInit {
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

  constructor(public dialog: MatDialog, public subInjectService: SubscriptionInject, private subService: SubscriptionService,
    private eventService: EventService, public subscription: SubscriptionService, private datePipe: DatePipe, private router: Router, private utilservice: UtilService) {
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
    (this.utilservice.checkSubscriptionastepData(6) == false) ? this.dataSource.data = [] : this.dataSource.data = [{}, {}, {}]
    this.getInvoiceSubData(false);
    this.showEdit = false;
    this.invoiceSubscription = 'false';
    this.invoiceDesign = 'true';
    this.dataCount = 0;
    console.log(this.router.url, "this.router.isActive");

  }

  scrollCall(scrollLoader) {
    const uisubs = document.getElementById('ui-subs');
    const wrapper = document.getElementById('wrapper');

    const contentheight = wrapper.offsetHeight;
    const yoffset = uisubs.scrollTop;
    const y = yoffset + window.innerHeight;
    // console.log(y >= contentheight && this.getData != undefined && this.scrollCallData, this.scrollCallData, "this.scrollCallData 123");
    console.log(this.getData != undefined, this.scrollCallData, '|| this.statusIdList.length > 0');

    if ((y >= contentheight && this.getData != undefined && this.scrollCallData)) {
      this.scrollCallData = false;
      if (this.scrollPosition == undefined) {
        this.scrollPosition = contentheight - yoffset;
      } else if (this.scrollPosition < contentheight) {
        this.scrollPosition = contentheight - window.innerHeight;
      }

      console.log(this.scrollPosition, 'this.scrollPosition 123');


      if (this.statusIdList.length <= 0) {

        this.getInvoiceSubData(scrollLoader);
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

    this.subscription.getInvoices(obj).subscribe(
      data => {
        this.getData = data;
        this.isLoading = false;

        if (data != undefined) {
          this.lastDataId = data[data.length - 1].id;
          // obj.offset = this.lastDataId;
          // console.log(this.lastDataId, obj, "data check");
          this.tableData = data;
          // if (this.tableData.length <= 0) {
          //   this.tableData = data;
          // } else {
          //   console.log(this.tableData, 'this.tableData 123');

          //   this.tableData = this.tableData.concat(data);
          //   console.log(this.tableData, 'this.tableData 123');
          // }
        } else {
        }
        this.getInvoiceResponseData(this.tableData);
      }, (error) => {
        this.eventService.showErrorMessage(error);
        this.dataSource.data = [];
        this.isLoading = false;
      }
    );
  }

  addInvoice(edit) {

    this.invoiceSubscription = edit;
    // this.invoiceDesign = edit;
    console.log('edit', edit);
  }

  getInvoiceResponseData(data) {
    // this.isLoading = false;
    // if (data == undefined) {
    //   this.dataSource.data = [];
    //   this.noData = 'No Data Found';
    // } else {
    //   console.log(data);
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
    console.log('  ho ho: ', data);

    if (data && data.length > 0) {
      this.data = data;
      this.invoiceClientData = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      uisubs.scrollTo(0, this.scrollPosition);
      console.log(uisubs.scrollTop, this.scrollPosition, 'this.yoffset');

      this.scrollCallData = true;
      // this.DataToSend = data;
    } else {
      this.data = [];
      this.dataSource.data = data;
      // console.log(data);
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
    console.log(' openInvoice this.loading : ', this.isLoading);
    console.log(' openInvoice data : ', data);
    console.log(' openInvoice value : ', value);
    console.log(' openInvoice state : ', state);

    if (this.isLoading) {
      console.log(' openInvoice this.loading : ', this.isLoading);
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
      console.log(this.dataSource.filteredData, this.dataSource.data, "data check api 123");

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

    console.log(data, "edited data invoice");
    if (data.closingState ) {
      this.dataSource.data = [{}, {}, {}]
      this.tableData = [];
      this.getInvoiceSubData(false);
      this.dataCount = 0;
    }
    this.invoiceSubscription = 'false';

    // this.ngOnInit();
  }
  getCancelInvoiceSubscription(data) {
    this.invoiceSubscription = 'false';

    if (data) {
      this.dataSource.data = [{}, {}, {}]
      this.tableData = [];
      this.getInvoiceSubData(false);
      this.dataCount = 0;
    }
    console.log(data, "cancel data invoice");
    // this.ngOnInit();
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


  callFilter(scrollLoader) {
    this.dataCount = 0;
    if (this.filterStatus && this.filterStatus.length > 0) {
      this.dataSource.data = [{}, {}, {}]
      this.isLoading = true;
      this.statusIdList = [];
      this.filterStatus.forEach(singleFilter => {
        this.statusIdList.push(singleFilter.value);
        console.log(this.statusIdList, 'this.statusIdList 1233');
      });
    } else {
      this.statusIdList = [];
    }
    // this.statusIdList = (this.sendData == undefined) ? [] : this.sendData;
    console.log(this.lastFilterDataId, this.statusIdLength < this.statusIdList.length, 'aaaa');

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
    console.log('this.callFilter req obj : ', obj);
    if (obj.statusIdList.length == 0 && obj.fromDate == null) {
      this.getInvoiceSubData(false);
    } else {
      this.subService.filterInvoices(obj).subscribe(
        (data) => {
          this.filterSubscriptionRes(data, scrollLoader);
        }
      );
    }
  }


  filterSubscriptionRes(data, scrollLoader) {
    console.log('filterSubscriptionRes', data);
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

  addFilters(addFilters) {

    console.log('addFilters', addFilters);
    // !_.includes(this.filterStatus, addFilters)
    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      this.lastFilterDataId = 0;
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
      console.log(this.filterStatus);
    } else {
      this.lastFilterDataId = 0;
      // _.remove(this.filterStatus, this.senddataTo);
    }

    console.log(this.filterStatus, 'this.filterStatus 123');

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
    console.log(this.selectedDateFilter, 'addFilters', dateFilter);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);

    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);

    this.selectedDateRange = { begin: beginDate, end: endDate };
    console.log(this.filterDate, 'this.filterDate 123');
    this.callFilter(false);
  }

  removeDate(item) {
    console.log(this.filterDate, 'this.filterDate 123 r');
    this.dataSource.data = [{}, {}, {}];
    this.selectedDateFilter = 'dateFilter';
    this.filterDate.splice(item, 1);
    this.lastFilterDataId = 0;
    this.callFilter(false);
  }

  remove(item) {
    console.log(item, 'item123');
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
    console.log(data, "data for filter");
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
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.subscription.deleteInvoices(this.list).subscribe(
          data => {
            this.dataCount = 0;
            this.eventService.openSnackBar('invoice deleted successfully.', 'dismiss');
            dialogRef.close(this.list);

          },
          error => this.eventService.showErrorMessage(error)
        );
        dialogRef.close(listIndex);

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
      console.log(result, this.dataSource.data, "delete result");
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
}
