import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from 'saturn-datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';


export const PICK_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'dd/MM/yyyy', this.locale);
      ;
    } else {
      return date.toDateString();
    }
  }
}

@Component({
  selector: 'app-mis-mf-transactions',
  templateUrl: './mis-mf-transactions.component.html',
  styleUrls: ['./mis-mf-transactions.component.scss'],
  providers: [
    [DatePipe],
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
  ],
})
export class MisMfTransactionsComponent implements OnInit {
  maxDate = new Date();
  rangesFooter;
  @ViewChild('tableEl', { static: false }) tableEl;
  displayedColumns: string[] = ['name', 'scheme', 'folio', 'tType', 'tDate'];
  data: Array<any> = [{}, {}, {}];
  mfTransaction = new MatTableDataSource(this.data);
  isLoading: boolean;
  fragmentData = { isSpinner: false };
  parentId: any;
  hasEndReached: boolean;
  infiniteScrollingFlag: boolean;
  showFilter: boolean;
  flag: any;
  selectedDateRange = {};
  chips = [
    { name: 'DEBT', id: 1, filterType: 'category' },
    { name: 'EQUITY', id: 2, filterType: 'category' },
    { name: 'HYBRID', id: 3, filterType: 'category' },
    { name: 'COMMODITY', id: 4, filterType: 'category' },
    { name: 'LIQUID', id: 5, filterType: 'category' }
  ];
  dateChips = [
    { name: 'Transaction date', value: 1 },
  ];
  transactionTypeChips = [
  ];
  filterStatus = [];
  filterDate = [];
  filterDataArr: any[];
  filterJson = {
    dateFilterJson: {},
    dateFilterArr: [],
    statusFilterJson: []
  }
  selectedStatusFilter: any = 'statusFilter';
  selectedTransactionFilter: any = 'tranFilter';
  selectedDateFilter: any = 'dateFilter';

  filterTransaction = [];
  obj: { transactionTypeId: any[]; categoryId: any[]; dateObj: {}; };

  constructor(private excel: ExcelGenService,
    private cusService: CustomerService,
    private backoffice: BackOfficeService,
    private eventService: EventService,
    private UtilService: UtilService,
  ) {
  }

  ngOnInit() {
    this.obj = { transactionTypeId: [], categoryId: [], dateObj: {} }
    this.hasEndReached = true;
    this.getTransactionType()
    //this.mfTransaction.data = ELEMENT_DATA;
    this.isLoading = false
    this.parentId = AuthService.getAdminAdvisorId();
    console.log(this.parentId)
    this.mfTransaction.data = [{}, {}, {}];
    this.getMfTransactionData(0)
  }

  onWindowScroll(e: any) {
    if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
      if (!this.hasEndReached) {
        this.infiniteScrollingFlag = true;
        this.hasEndReached = true;
        this.getMfTransactionData(this.mfTransaction.data.length);
        // this.getClientList(this.finalClientList[this.finalClientList.length - 1].clientId)
      }

    }
  }

  getTransactionType() {
    this.cusService.getTransactionTypeData({})
      .subscribe(res => {
        if (res) {
          this.transactionTypeChips = res;
          this.transactionTypeChips.forEach(element => {
            element.filterType = 'transactionType'
          });
          console.log('transsaction type', this.transactionTypeChips)
        } else {
          this.eventService.openSnackBar("No TransactionType Data Found", "Dismiss");
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
  }

  addFilters(addFilters) {

    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
    } else {

    }
    this.filterJson.statusFilterJson = this.filterStatus;
    this.filterApi(this.filterStatus)
  }

  addTransactionType(event) {
    if (this.filterStatus.find(element => element.transactionType == event.transactionType) == undefined) {
      this.filterStatus.push(event);
      this.filterDataArr = [];
    } else {

    }
    this.filterJson.statusFilterJson = this.filterStatus;
    this.filterApi(this.filterStatus)
  }

  addFiltersDate(dateFilter) {
    this.filterDate = [];

    if (this.filterDate.length >= 1) {
      this.filterDate = [];
    }
    this.filterDataArr = [];
    let filterValue = dateFilter.value;
    this.filterDate.push((filterValue.value == 1) ? 1 : (filterValue.value == 2) ? 2 : 3);
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    UtilService.getStartOfTheDay(beginDate);
    const endDate = new Date();
    UtilService.getStartOfTheDay(endDate);
    this.selectedDateRange = { begin: beginDate, end: endDate };
    this.filterJson.dateFilterJson = this.selectedDateRange;
    this.filterJson.dateFilterArr = this.filterDate;
    this.filterApi(this.filterJson)
  }

  removeDate(item) {
    this.selectedDateFilter = 'dateFilter';
    this.filterDate.splice(item, 1);
  }

  remove(item) {
    if (this.filterStatus[item].name == this.selectedStatusFilter.name) {
      this.selectedStatusFilter = 'statusFilter';
    }

    this.filterStatus.splice(item, 1);
    this.filterDataArr = this.filterDataArr.filter((x) => {
      x.status != item.value;
    });
  }
  filterApi(list) {
    console.log(list)

    if (list.dateFilterJson) {
      this.obj.dateObj = list.dateFilterJson
    } else {
      list.forEach(element => {
        if (element.filterType == 'transactionType') {
          this.obj.transactionTypeId.push(element)
        } else if (element.filterType == 'category') {
          this.obj.categoryId.push(element)
        }
      });
    }
    console.log('json', this.obj)
    this.backoffice.filterData(this.obj)
      .subscribe(res => {
        console.log(res);
        // this.isLoading = false
        // this.mfTransaction = res
      }, err => {
        console.error(err);
      })
  }
  selectOption(value) {
    this.flag = value
  }

  applyFilter(event) {

  }


  onClose() {
  }

  getMfTransactionData(endFlag) {
    this.isLoading = true
    const obj = {
      parentId: this.parentId,
      startFlag: endFlag,
      endFlag: endFlag + 50,
    };

    this.backoffice.getMfTransactions(obj)
      .subscribe(res => {
        console.log(res);
        if (res) {
          this.isLoading = false
          this.mfTransaction.data = res
        } else {
          this.isLoading = false
          this.mfTransaction.data = []
        }
      }, err => {
        console.error(err);
      })

  }

  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
  }
}

export interface PeriodicElement {
  name: string;
  scheme: string;
  folio: number;
  tType: string;
  tDate: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Rahul Jain',
    scheme: 'HDFC Equity fund - Regular plan - Growth option | 098098883',
    folio: 2345772,
    tType: 'STP 5,000',
    tDate: '05/09/2019'
  },
];
