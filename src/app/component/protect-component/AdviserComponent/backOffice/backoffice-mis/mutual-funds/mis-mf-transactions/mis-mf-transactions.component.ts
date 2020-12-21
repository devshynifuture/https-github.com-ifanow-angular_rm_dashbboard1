import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from 'saturn-datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { UtilService } from 'src/app/services/util.service';
import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import moment from 'moment';


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
  @ViewChild(MatSort, { static: true }) sort: MatSort;
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
  obj: { transactionTypeId: any[]; categoryId: any[]; begin: {}, end: {}; parentId: {}; startFlag: {}; endFlag: {} };

  constructor(private excel: ExcelGenService,
    private cusService: CustomerService,
    private backoffice: BackOfficeService,
    private eventService: EventService,
    private UtilService: UtilService,
    private datePipe: DatePipe,

  ) {
  }

  ngOnInit() {
    this.obj = { transactionTypeId: [], categoryId: [], begin: {}, end: {}, parentId: {}, startFlag: {}, endFlag: {} }
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
  orgValueChange(selectedDateRange) {
    this.filterJson.dateFilterJson = { begin: (moment(selectedDateRange.begin).format('YYYY-MM-DD')), end: (moment(selectedDateRange.end).format('YYYY-MM-DD')) };
    this.filterApi(this.filterJson)
    selectedDateRange = {};
  }
  addFilters(addFilters) {

    if (this.filterStatus.find(element => element.name == addFilters.name) == undefined) {
      this.filterStatus.push(addFilters);
      this.filterDataArr = [];
    }
    this.filterJson.statusFilterJson = this.filterStatus;
    this.filterApi(this.filterStatus)
  }

  addTransactionType(event) {
    if (this.filterStatus.find(element => element.transactionType == event.transactionType) == undefined) {
      this.filterStatus.push(event);
      this.filterDataArr = [];
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
    this.selectedDateRange = { begin: (moment(beginDate).format('YYYY-MM-DD')), end: (moment(endDate).format('YYYY-MM-DD')) };
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
    if (this.obj.transactionTypeId.length > 0) {
      this.obj.transactionTypeId = this.obj.transactionTypeId.filter((ele) => {
        return item.id == ele.id
      });
      this.filterApi(this.obj.transactionTypeId)
    } else if (this.obj.categoryId.length > 0) {
      this.obj.categoryId = this.obj.categoryId.filter((ele) => {
        return item.id == ele.id
      });
      this.filterApi(this.obj.categoryId)
    }
  }
  onClose() {
    this.orgValueChange(this.selectedDateRange);
  }
  filterApi(list) {
    console.log(list)

    if (list.dateFilterJson) {
      this.obj.end = list.dateFilterJson.end
      this.obj.begin = list.dateFilterJson.begin
    } else {
      list.forEach(element => {
        if (element.filterType == 'transactionType') {
          if (this.obj.transactionTypeId.length == 0) {
            this.obj.transactionTypeId.push(element)

          } else {
            this.obj.transactionTypeId.forEach(ele => {
              if (element.id != ele.id) {
                this.obj.transactionTypeId.push(element)

              }
            })
          }

        } else if (element.filterType == 'category') {
          if (this.obj.categoryId.length == 0) {
            this.obj.categoryId.push(element)

          } else {
            this.obj.categoryId.forEach(ele => {
              if (element.id != ele.id) {
                this.obj.categoryId.push(element)
              }
            })
          }

        }
      });
    }
    this.isLoading = true
    this.obj.parentId = this.parentId;
    this.obj.startFlag = 1
    this.obj.endFlag = 100
    if (this.obj.end != {} || this.obj.begin != {}) {
      this.obj.end = moment(this.obj.end).format('YYYY-MM-DD')
      this.obj.begin = moment(this.obj.begin).format('YYYY-MM-DD')
    }
    console.log('json', this.obj)
    let data = {}
    data = this.obj
    this.backoffice.filterData(data)
      .subscribe(res => {
        console.log('filtered json', res);
        this.isLoading = false
        this.mfTransaction = res
      }, err => {
        console.error(err);
      })
  }
  selectOption(value) {
    this.flag = value
  }

  onSearchChange(event) {
    console.log('key', event)
    if (event.length > 3) {
      let obj = {
        searchFlag: this.flag,
        search: event
      }
      this.backoffice.searchData(obj)
        .subscribe(res => {
          console.log('filtered json', res);
        }, err => {
          console.error(err);
        })
    }
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
          this.mfTransaction.sort = this.sort
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
