import { MatTableDataSource } from '@angular/material';
import { HttpHeaders } from '@angular/common/http';
import { EventService } from './../../../../../../../../../../Data-service/event.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomerService } from 'src/app/component/protect-component/customers/component/customer/customer.service';
import { AuthService } from './../../../../../../../../../../auth-service/authService';
import { SubscriptionInject } from './../../../../../../../../AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-mf-import-cas-file',
  templateUrl: './mf-import-cas-file.component.html',
  styleUrls: ['./mf-import-cas-file.component.scss']
})

export class MfImportCasFileComponent implements OnInit {
  filename: any;
  successFileUpload: boolean;
  constructor(
    private cusService: CustomerService,
    private fb: FormBuilder,
    private subInjectService: SubscriptionInject,
    private eventService: EventService
  ) { }
  uploadCasFileForm = this.fb.group({
    file: [, Validators.required],
    password: [, Validators.required]
  });
  clientId = AuthService.getClientId();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'member'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol', 'member'];
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  displayedColumns3: string[] = ['position', 'weight'];
  dataSource3 = new MatTableDataSource(ELEMENT_DATA3);
  displayedColumns5: string[] = ['position', 'name', 'weight'];
  dataSource5 = new MatTableDataSource(ELEMENT_DATA5);

  ngOnInit() {
  }
  currentTabValue = 1;
  pastUploadedCasFile = false;
  showPointsIfRefreshed = false;
  showMappingTables = false;
  transactionTypeList = [];

  onFileSelect(event) {
    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const filename = file.name;
      this.filename = filename;
      this.uploadCasFileForm.get('file').setValue(file);
    }
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('casFile', this.uploadCasFileForm.get('file').value, this.uploadCasFileForm.get('file').value.name);
    let obj = {
      clientId: this.clientId,
      password: this.uploadCasFileForm.get('password').value
    }
    let clientExtras = JSON.stringify(obj);
    formData.append('request', clientExtras);

    this.cusService.postUploadCasFile(formData)
      .subscribe(res => {
        if (res) {
          this.successFileUpload = true;
          console.log(res);
          this.currentTabValue = 2;
          this.getStatusOfPastFileUpload();
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }

  getTransactionTypeList() {
    this.cusService.getTransactionTypeData({})
      .subscribe(res => {
        if (res) {
          this.transactionTypeList = res;
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }

  getClientLatestCasLog() {
    let data = {
      clientId: this.clientId
    }
    this.cusService.getClientLatestCASFileLogs(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }

  changeCurrentTab(value): void {
    this.currentTabValue = +value;
    if (value === 2) {
      this.getStatusOfPastFileUpload();
    }
  }

  showPastUploadedCasFile(): void {
    this.currentTabValue = null;
    this.pastUploadedCasFile = true;
  }

  backFromPastUploadedCasFileStatus(): void {
    this.pastUploadedCasFile = false;
    this.currentTabValue = 1;
  }

  getClientCASFileDetailData() {
    this.cusService.getClientCasFileDetailData({ clientId: this.clientId })
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }


  mapInvestor() {
    let data = [
      {
        id: 'id from unmapped investors',
        clientId: this.clientId,
        familyMemberId: 'familyMemberId',
        investorName: 'name'
      }
    ];
    this.cusService.putMapInvestor(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      });
  }

  mapTransaction() {
    let data = [
      {
        id: 'id from unmapped transactions list',
        fwTransactionType: 'transactionType from transaction type get api',
        effect: 'effect from transaction type get api',
        transactionTypeMasterId: 'id from transaction type get api',
        assetMutualFundTransactionTypeMasterId: 'assetTypeTransactionId from transaction type get api'
      }
    ]

    this.cusService.putMapTransaction(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }

  getStatusOfPastFileUpload() {
    this.cusService.getStatusOfPastFileUpload({ clientId: this.clientId })
      .subscribe(res => {
        if (res) {
          console.log("cas file status", res);
          this.dataSource5.data = res;
          /*
            status
            -1 - Error
            0 - In Queue
            1 - File Imported
            2 - Data Processed
          */
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }

  getCasFileLogOnRefresh(id) {
    this.cusService.getCasFileLogOnRefresh({ casUploadLogId: id })
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      });
  }

  updateCasFileStatus() {
    let data = {
      id: 21,
      processStatus: 2
    }

    //     id of selected cas log obj,
    // processStatus 2 for Data processed after completion of all mapping
    this.cusService.putCasFileStatusUpdate(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      }, err => {
        console.log(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      })
  }

  close() {
    this.subInjectService.changeNewRightSliderState({
      state: 'close',
    });
  }
}
export interface PeriodicElement {
  name: string;
  // position: number;
  weight: number;
  symbol: string;
  member: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	', weight: 34549593 / 90, symbol: 'AATDF9032L', member: 'Rahul Jain' },

];
export interface PeriodicElement2 {
  name: string;
  // position: number;
  weight: string;
  symbol: string;
  member: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	', weight: '5,00,000', symbol: 'Redemption - ELECTRONIC PAYMENT', member: 'Purchase' },

]

export interface PeriodicElement3 {
  position: string;
  // position: number;
  weight: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	', weight: 'B12' },

]
export interface PeriodicElement5 {
  position: string;
  name: string;
  weight: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { position: '0201765602028054DL4B6A8188390701PA3CPIMBCP107033681.pdf	', name: '10/11/2020 12.30PM', weight: 'In Queue. Click to Refresh' },

]