import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { BackOfficeService } from '../../../../back-office.service';
import { SipComponent } from '../sip.component';
import { MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { EventService } from '../../../../../../../../Data-service/event.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { ExcelMisSipService } from '../../aum/excel-mis-sip.service';
import { ELEMENT_DATA } from '../../../../backoffice-aum-reconciliation/duplicate-data/duplicate-data.component';
import { offset } from 'highcharts';

@Component({
  selector: 'app-all-sip',
  templateUrl: './all-sip.component.html',
  styleUrls: ['./all-sip.component.scss']
})
export class AllSipComponent implements OnInit {
  advisorId: any;
  dataSource: any;
  showLoader = true;
  displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate',
    'frequency', 'amount'];
  totalAmount = 0;
  isLoading = false;
  parentId = AuthService.getUserInfo().parentId ? AuthService.getUserInfo().parentId : -1;
  @Input() mode;
  @Input() data;
  @Output() changedValue = new EventEmitter();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('tableEl', { static: false }) tableEl;
  arnRiaValue: any;
  viewMode: any;
  hasEndReached: any = false;
  infiniteScrollingFlag: boolean;
  finalSipList: any = [];
  currentPageIndex: any = 0;
  totalSipCount: any;
  pageEvent: PageEvent;

  constructor(
    private backoffice: BackOfficeService,
    private sip: SipComponent,
    private eventService: EventService,
    private excelGen: ExcelMisSipService
  ) {
  }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.dataSource = new MatTableDataSource([{}, {}, {}]);
    this.isLoading = true;
    if (this.mode == 'expired') {
      this.displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate', 'ceaseDate', 'amount', 'status', 'remark'];
    } else if (this.mode == 'expiring') {
      this.displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate', 'amount',];
    } else {
      this.displayedColumns = ['no', 'applicantName', 'schemeName', 'folioNumber', 'fromDate', 'toDate', 'frequency', 'amount', 'status'];
    }

    if (this.data.hasOwnProperty('arnRiaValue') && this.data.hasOwnProperty('viewMode')) {
      this.arnRiaValue = this.data.arnRiaValue;
      this.viewMode = this.data.viewMode;
    } else {
      this.viewMode = 'All';
      this.arnRiaValue = -1;
    }
    this.getAllSip(200, 1);
  }

  getAllSIPdataThenCreateExcel() {
    this.getAllSip(50000, 1);
  }

  formatDataForExcel(data) {
    let arr = [];
    if (data.length > 0) {
      data.forEach((element, index) => {
        const data = [
          index + 1,
          element.investorName,
          element.schemeName,
          element.folioNumber,
          new Date(element.from_date).toLocaleDateString(),
          new Date(element.to_date).toLocaleDateString(),
          element.frequency,
          element.amount,
          element.status
        ];
        arr.push(data);
      });
    }
    this.excelGen.generateAllSipExcel(arr, 'Sip');
  }

  Excel(tableTitle) {
    const rows = this.tableEl._elementRef.nativeElement.rows;
    this.excelGen.generateExcel(rows, tableTitle);
  }

  // Excel(tableTitle) {
  //   setTimeout(() => {
  //     var blob = new Blob([document.getElementById('template').innerHTML], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  //     });
  //     saveAs(blob, tableTitle + ".xls");
  //   }, 200);
  //   // if (data) {
  //   //   this.fragmentData.isSpinner = false;
  //   // }
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  getAllSip(limit, pageNumber) {
    // this.isLoading = true;
    // this.dataSource = new MatTableDataSource([{}, {}, {}]);
    const obj = {
      limit,
      pageNumber,
      advisorId: (this.parentId > 0) ? this.advisorId : 0,
      arnRiaDetailsId: (this.data) ? this.data.arnRiaId : -1,
      parentId: (this.data) ? this.data.parentId : -1,
      offset: 0
    };
    if (this.mode == 'all') {
      this.backoffice.allSipGet(obj).subscribe(
        data => {
          (this.finalSipList.length > 0) ? '' : this.isLoading = false;
          this.isLoading = false;
          if (data) {
            console.log("this is all sip table data, ------", data)
            this.response(data);
          } else {
            this.dataSource.filteredData = [];
            this.dataSource.data = (this.finalSipList.length > 0) ? this.finalSipList : null;
            this.eventService.openSnackBar('No More Data Found', "DISMISS");
            this.hasEndReached = true;
          }

        },
        err => {
          this.isLoading = false;
          this.dataSource.filteredData = [];
          this.hasEndReached = true;
          this.dataSource.data = (this.finalSipList.length > 0) ? this.finalSipList : null;
          this.eventService.openSnackBar('No More Data Found', "DISMISS");
        }
      );
    } else if (this.mode == 'expired') {
      this.backoffice.GET_expired(obj).subscribe(
        data => {
          this.isLoading = false;
          if (data) {
            this.response(data);
          } else {
            this.dataSource.filteredData = [];
            this.dataSource.data = (this.finalSipList.length > 0) ? this.finalSipList : null;
            this.eventService.openSnackBar('No More Data Found', "DISMISS");
          }

        },
        err => {
          this.isLoading = false;
          this.dataSource.filteredData = [];
        }
      );
    } else {
      this.backoffice.GET_EXPIRING(obj).subscribe(
        data => {
          this.isLoading = false;
          if (data) {
            this.response(data);
          } else {
            this.dataSource.filteredData = [];
            this.dataSource.data = (this.finalSipList.length > 0) ? this.finalSipList : null;
            this.eventService.openSnackBar('No More Data Found', "DISMISS");
          }

        },
        err => {
          this.isLoading = false;
          this.dataSource.filteredData = [];
        }
      );
    }

  }

  onPaginationChange(event) {
    const { pageIndex } = event;
    this.currentPageIndex = pageIndex + 1;
    this.isLoading = true;
    this.dataSource.data = [{}, {}, {}];
    this.getAllSip(200, this.currentPageIndex);
    return event;
  }

  // onWindowScroll(e: any) {

  //   console.log(this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop, (e.target.scrollTop + e.target.offsetHeight));

  //   if (this.tableEl._elementRef.nativeElement.querySelector('tbody').querySelector('tr:last-child').offsetTop <= (e.target.scrollTop + e.target.offsetHeight + 200)) {
  //     if (!this.hasEndReached) {
  //       this.infiniteScrollingFlag = true;
  //       this.getAllSip(this.finalSipList.length, 20);
  //       // this.getClientList(this.finalSipList[this.finalSipList.length - 1].clientId)
  //     }

  //   }
  // }

  response(data) {
    // this.finalSipList = this.finalSipList.concat(data);
    this.finalSipList = data;
    this.totalSipCount = data[0].totalSipCount;
    this.dataSource = new MatTableDataSource(this.finalSipList);
    this.dataSource.sort = this.sort;
    this.dataSource.filteredData.forEach(element => {
      this.totalAmount += element.amount;
    });
    this.hasEndReached = false;
    this.infiniteScrollingFlag = false;
  }



  aumReport() {
    this.changedValue.emit({
      value: true,
      arnRiaValue: this.arnRiaValue,
      viewMode: this.viewMode
    });
    //  this.sip.sipComponent=true;
  }
}
