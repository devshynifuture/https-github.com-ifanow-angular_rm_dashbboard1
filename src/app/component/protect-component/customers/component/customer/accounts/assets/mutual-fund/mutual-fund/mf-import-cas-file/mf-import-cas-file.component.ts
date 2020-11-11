import { SelectionModel } from '@angular/cdk/collections';
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
  uploadFileStatusMsg: string;
  currentCasFileObject: any;
  unmappedInvestorList: any[] = [];
  unmappedTransactionList: any[] = [];
  unmappedSchemeList: any[] = [];
  constructor(
    private cusService: CustomerService,
    private fb: FormBuilder,
    private subInjectService: SubscriptionInject,
    private eventService: EventService
  ) { }

  filename: any;
  successFileUpload: boolean;
  isLoading: boolean;
  casFileUploadId: number;
  isFileStatusProceed = false;
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
  currentTabValue = 1;
  pastUploadedCasFile = false;
  showPointsIfRefreshed = false;
  showMappingTables = false;
  transactionTypeList = [];
  shouldShowSaveAndProceed = false;
  selectionInvestor = new SelectionModel<any>(true, []);
  selectionTransaction = new SelectionModel<any>(true, []);

  ngOnInit() {
  }

  isAllSelected(choice) {
    if (choice === 'investor') {
      const numSelected = this.selectionInvestor.selected.length;
      let numRows;
      if (this.dataSource.data) {
        numRows = this.dataSource.data.length;
      } else {
        numRows = 0;
      }
      return numSelected === numRows;
    } else if (choice === 'transaction') {
      const numSelected = this.selectionTransaction.selected.length;
      let numRows;
      if (this.dataSource2.data) {
        numRows = this.dataSource2.data.length;
      } else {
        numRows = 0;
      }
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(choice) {
    if (choice === 'investor') {
      this.isAllSelected(choice) ?
        this.selectionInvestor.clear() :
        this.dataSource.data.forEach(row => this.selectionInvestor.select(row));
    } else if (choice === 'transaction') {
      this.isAllSelected(choice) ?
        this.selectionTransaction.clear() :
        this.dataSource2.data.forEach(row => this.selectionTransaction.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(choice, row?: any): string {
    if (choice === 'investor') {
      if (!row) {
        return `${this.isAllSelected(choice) ? 'select' : 'deselect'} all`;
      }
      return `${this.selectionInvestor.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    } else if (choice === 'transaction') {
      if (!row) {
        return `${this.isAllSelected(choice) ? 'select' : 'deselect'} all`;
      }
      return `${this.selectionTransaction.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }
  }

  onFileSelect(event) {
    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'application/pdf') {
        const filename = file.name;
        this.filename = filename;
        this.uploadCasFileForm.get('file').setValue(file);
      } else {
        this.uploadCasFileForm.get('file').markAsTouched();
      }
    }
  }

  uploadFile() {
    if (this.uploadCasFileForm.valid) {
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
            this.casFileUploadId = +atob(res['payLoad']);
            this.currentTabValue = 2;
          }
        }, err => {
          console.error(err);
          this.eventService.openSnackBar('Something went wrong!', "DISMISS");
        })
    } else {
      this.uploadCasFileForm.markAllAsTouched();
    }
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

  changeCurrentTab(value, choice?): void {
    if (choice) {
      switch (choice) {
        case 'showMappingTable':
          this.currentTabValue = null;
          this.pastUploadedCasFile = false;
          this.showPointsIfRefreshed = false;
          this.showMappingTables = true;
          this.getClientCASFileDetailData();
          break;
      }
    } else {
      this.currentTabValue = +value;
      if (value === 2) {
        this.getStatusOfPastFileUpload();
      }
    }
  }

  showPastUploadedCasFile(): void {
    this.currentTabValue = null;
    this.pastUploadedCasFile = true;
    this.dataSource5.data = ELEMENT_DATA5;
    this.getStatusOfPastFileUpload();
  }

  backFromPastUploadedCasFileStatus(): void {
    this.pastUploadedCasFile = false;
    this.currentTabValue = 1;
  }

  setCasFileObject(element) {
    this.currentCasFileObject = element;
  }

  getClientCASFileDetailData() {
    this.isLoading = true;
    this.cusService.getClientCasFileDetailData({ casUploadLogId: this.currentCasFileObject.id })
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          console.log("this is detailed data including investor", res);
          this.unmappedInvestorList = [...res.unmappedInvestors];
          this.unmappedTransactionList = [...res.unmappedTransactions];
          this.unmappedSchemeList = [...res.unmappedSchemes];
          if (this.unmappedInvestorList.length > 0) {
            this.dataSource.data = this.unmappedInvestorList;
          } else {
            this.dataSource.data = null
          }

          if (this.unmappedTransactionList.length > 0) {
            this.dataSource2.data = this.unmappedTransactionList;
          } else {
            this.dataSource2.data = null;
          }

          if (this.unmappedSchemeList.length > 0) {
            this.dataSource3.data = this.unmappedSchemeList;
          } else {
            this.dataSource3.data = null;
          }
        }
      }, err => {
        this.isLoading = false;
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
    this.isLoading = true;
    this.cusService.getStatusOfPastFileUpload({ clientId: this.clientId })
      .subscribe(res => {
        if (res) {
          this.isLoading = false;
          console.log("cas file status", res);
          this.dataSource5.data = res;

          res.map(item => {
            item.isLoading = false;
            switch (item.processStatus) {
              case -1: item.status = 'Error';
                break;

              case 0: item.status = 'In Queue';
                break;

              case 1: item.status = 'File Imported';
                break;

              case 2: item.status = 'Data Processed';
                break;
            }
          });
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

  getCasFileLogOnRefresh(choice) {
    let data;
    if (choice === 'single') {
      this.dataSource5.data.find(item => item['id'] === this.currentCasFileObject.id)['isLoading'] = true;
      data = { casUploadLogId: this.currentCasFileObject.id };
    } else {
      data = { casUploadLogId: this.casFileUploadId };
    }
    this.cusService.getCasFileLogOnRefresh(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          if (choice == 'multiple') {
            switch (res.processStatus) {
              case -1:
                this.uploadFileStatusMsg = 'File Imported';
                this.isFileStatusProceed = false;
                this.showPointsIfRefreshed = true;
                break;

              case 0:
                this.uploadFileStatusMsg = 'In Queue';
                this.isFileStatusProceed = false;
                break;

              case 1:
                this.uploadFileStatusMsg = 'File Imported';
                this.isFileStatusProceed = true;
                break;

              case 2:
                this.uploadFileStatusMsg = 'Data Processed';
                this.isFileStatusProceed = true;
                break;
            }
          } else if (choice == 'single') {
            this.dataSource5.data.map(item => {
              if (item['id'] === this.currentCasFileObject.id) {
                item['isLoading'] = false;
                res.isLoading = false;
                item = { ...res };
                switch (res.processStatus) {
                  case -1: item.status = 'Error';
                    break;

                  case 0: item.status = 'In Queue';
                    break;

                  case 1: item.status = 'File Imported';
                    break;

                  case 2: item.status = 'Data Processed';
                    break;
                }
              }
            });
          }
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
  position: string;
  name: string;
  weight: string;
  symbol: string;
  member: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: '', name: '', weight: '', symbol: '', member: '' },
  { position: '', name: '', weight: '', symbol: '', member: '' },
  { position: '', name: '', weight: '', symbol: '', member: '' },

];
export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  member: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: '', name: '', weight: '', symbol: '', member: '' },
  { position: '', name: '', weight: '', symbol: '', member: '' },
  { position: '', name: '', weight: '', symbol: '', member: '' },

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
  fileName: string;
  uploadTime: string;
  status: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { fileName: '', uploadTime: '', status: '' },
  { fileName: '', uploadTime: '', status: '' },
  { fileName: '', uploadTime: '', status: '' },

]