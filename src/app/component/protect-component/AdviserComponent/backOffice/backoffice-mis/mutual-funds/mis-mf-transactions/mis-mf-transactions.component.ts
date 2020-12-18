import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { BackOfficeService } from '../../../back-office.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-mis-mf-transactions',
  templateUrl: './mis-mf-transactions.component.html',
  styleUrls: ['./mis-mf-transactions.component.scss']
})
export class MisMfTransactionsComponent implements OnInit {

  @ViewChild('tableEl', { static: false }) tableEl;
  displayedColumns: string[] = ['name', 'scheme', 'folio', 'tType', 'tDate'];
  data: Array<any> = [{}, {}, {}];
  mfTransaction = new MatTableDataSource(this.data);
  isLoading: boolean;
  fragmentData = { isSpinner: false };
  parentId: any;
  hasEndReached: boolean;
  infiniteScrollingFlag: boolean;
  flag: any;


  constructor(private excel: ExcelGenService,
    private backoffice: BackOfficeService,
    private eventService: EventService,
  ) { }

  ngOnInit() {
    this.hasEndReached = true;

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
  selectOption(value) {
    this.flag = value
  }
  applyFilter(event) {


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
        this.isLoading = false
        this.mfTransaction = res
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
  { name: 'Rahul Jain', scheme: 'HDFC Equity fund - Regular plan - Growth option | 098098883', folio: 2345772, tType: 'STP 5,000', tDate: '05/09/2019' },
];