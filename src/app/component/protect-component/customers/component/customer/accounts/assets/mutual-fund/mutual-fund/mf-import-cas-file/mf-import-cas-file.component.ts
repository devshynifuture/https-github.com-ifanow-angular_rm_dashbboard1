import { ClientSggestionListService } from './../../../../../customer-overview/overview-profile/client-sggestion-list.service';
import { CancelFlagService } from './../../../../../../../../PeopleComponent/people/Component/people-service/cancel-flag.service';
import { UtilService } from './../../../../../../../../../../services/util.service';
import { AddClientComponent } from './../../../../../../../../PeopleComponent/people/Component/people-clients/add-client/add-client.component';
import { AddFamilyMemberComponent } from './../../../../../customer-overview/overview-profile/add-family-member/add-family-member.component';
import { EnumDataService } from './../../../../../../../../../../services/enum-data.service';
import { SelectFolioMapComponent } from './../../../../../../../../AdviserComponent/backOffice/backoffice-folio-mapping/select-folio-map/select-folio-map.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatDialog } from '@angular/material';
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
  familyMemberList: any;
  duplicateFlag: boolean;
  clientData = AuthService.getClientData();
  advisorId = AuthService.getAdvisorId();
  matTabIndex: number = 0;
  investorUnmappedCount: number;
  transactionUnmappedCount: number;
  constructor(
    private cusService: CustomerService,
    private fb: FormBuilder,
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private dialog: MatDialog,
    private enumDataService: EnumDataService,
    private cancelFlagService: CancelFlagService,
    private clientSuggeService: ClientSggestionListService
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
    this.getFamilyMemberList();
    this.getTransactionTypeList();
  }


  getFamilyMemberList() {
    this.cusService.getFamilyMemberListForCasMapping({ clientId: this.clientId })
      .subscribe(res => {
        if (res) {
          this.familyMemberList = res;
          console.log('this is family member,', res);
        }
      })
  }

  openAddNewFamilyMember(value, data) {
    this.enumDataService.setRelationShipStatus();
    let component;
    if (value == 'add') {

      if (this.clientData.clientType == 1) {
        if (this.familyMemberList) {
          let relationType = (this.clientData.genderId == 1) ? 3 : 2
          this.duplicateFlag = this.familyMemberList.some(element => {
            if (element.relationshipId == relationType) {
              return true
            } else {
              return false
            }
          })
        } else {
          this.duplicateFlag = false;
        }
      }
      this.clientData['duplicateFlag'] = this.duplicateFlag;
      component = AddFamilyMemberComponent;

      let ClientList = Object.assign([], this.enumDataService.getEmptySearchStateData());
      ClientList = ClientList.filter(element => element.userId != this.clientData.userId);
      data = { flag: 'Add member', fieldFlag: 'familyMember', client: this.clientData, ClientList };
    }
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open50',
      componentName: component,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (sideBarData.refreshRequired || this.cancelFlagService.getCancelFlag()) {
            this.getFamilyMemberList();
            this.enumDataService.searchClientList();
            this.cancelFlagService.setCancelFlag(undefined);
            this.clientSuggeService.setEmptySuggestionList();
            this.familyMemberList = undefined;
            if (this.clientData.mobileList && this.clientData.mobileList.length > 0) {
              this.clientData.mobileNo = this.clientData.mobileList[0].mobileNo;
              const obj =
              {
                advisorId: AuthService.getAdvisorId(),
                isdCodeId: this.clientData.mobileList[0].isdCodeId,
                mobileNo: this.clientData.mobileNo
              }
              this.clientSuggeService.setSuggestionListUsingMobile(obj);
            }
            if (this.clientData.emailList && this.clientData.emailList.length > 0) {
              this.clientData.email = this.clientData.emailList[0].email;
              const obj =
              {
                advisorId: AuthService.getAdvisorId(),
                email: this.clientData.email
              }
              this.clientSuggeService.setSuggestionListUsingEmail(obj);
            }
          }
          if (UtilService.isRefreshRequired(sideBarData)) {
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
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
          this.shouldShowSaveAndProceed = true;
          this.dataSource.data = ELEMENT_DATA;
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
    if (this.showMappingTables) {
      this.showMappingTables = false;
    }
    if (this.shouldShowSaveAndProceed) {
      this.shouldShowSaveAndProceed = false;
    }
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
            this.unmappedInvestorList.map(o => {
              o.isMapped = false;
              o.mappedMemberName = '';
            })
            this.dataSource.data = this.unmappedInvestorList;
            this.investorUnmappedCount = this.unmappedInvestorList.length;
          } else {
            this.dataSource.data = null;
          }

          if (this.unmappedTransactionList.length > 0) {
            this.unmappedTransactionList.map(o => {
              o.isMapped = false;
              o.mappedTransactionTypeName = '';
            });
            this.dataSource2.data = this.unmappedTransactionList;
            this.transactionUnmappedCount = this.unmappedTransactionList.length;
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


  mapInvestor(item, choice, element) {
    let data = [];
    switch (choice) {
      case 'single':
        data = [
          {
            id: element.id,
            clientId: this.clientId,
            familyMemberId: item.familyMemberId,
            investorName: item.displayName
          }
        ];
        break;
      case 'multiple':
        this.selectionInvestor.selected.forEach(item1 => {
          data.push({
            id: item1.id,
            clientId: this.clientId,
            familyMemberId: item.familyMemberId,
            investorName: item.displayName
          })
        });
        break;
    }
    this.cusService.putMapInvestor(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          if (choice === 'single') {
            this.dataSource.data.map(item1 => {
              if (item1['id'] === element.id) {
                item1['isMapped'] = true;
                item1['mappedMemberName'] = item.displayName;
              }
            })
          } else if (choice === 'multiple') {
            this.selectionInvestor.selected.forEach(item2 => {
              this.dataSource.data.find(item1 => item1['id'] === item2.id)['isMapped'] = true;
              this.dataSource.data.find(item1 => item1['id'] === item2.id)['mappedMemberName'] = item.displayName;
            })
          }
          this.selectionInvestor.clear();
          this.investorUnmappedCount = 0;
          this.dataSource.data.forEach(item => {
            if (!item['isMapped']) {
              this.investorUnmappedCount += 1;
            }
          })
        }
      }, err => {
        console.error(err);
        this.eventService.openSnackBar('Something went wrong!', "DISMISS");
      });
  }

  mapTransaction(item, choice, element) {
    let data = [];
    switch (choice) {
      case 'single':
        data = [
          {
            id: element.id,
            fwTransactionType: item.transactionType,
            effect: item.effect,
            transactionTypeMasterId: item.id,
            assetMutualFundTransactionTypeMasterId: item.assetTypeTransactionId,
            advisorId: this.advisorId
          }
        ]
        break;

      case 'multiple':
        this.selectionTransaction.selected.forEach(element => {
          data.push({
            id: element.id,
            fwTransactionType: item.transactionType,
            effect: item.effect,
            transactionTypeMasterId: item.id,
            assetMutualFundTransactionTypeMasterId: item.assetTypeTransactionId,
            advisorId: this.advisorId
          });
        })
    }

    this.cusService.putMapTransaction(data)
      .subscribe(res => {
        if (res) {
          console.log(res);
          if (choice == 'single') {
            this.dataSource2.data.map(item1 => {
              if (item1['id'] === element.id) {
                item1['isMapped'] = true;
                item1['mappedTransactionTypeName'] = item.transactionType;
              }
            })
          } else if (choice === 'multiple') {
            this.selectionTransaction.selected.forEach(item1 => {
              this.dataSource2.data.find(item2 => item2['id'] === item1.id)['isMapped'] = true;
              this.dataSource2.data.find(item2 => item2['id'] === item1.id)['mappedTransactionTypeName'] = item.transactionType;
            })
          }
          this.selectionTransaction.clear();
          this.transactionUnmappedCount = 0;
          this.dataSource2.data.forEach(item => {
            if (!item['isMapped']) {
              this.transactionUnmappedCount += 1;
            }
          })
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

  changeViewToMappingTableAfterFileUpload() {
    this.showMappingTables = true;
    this.currentTabValue = null;
    this.pastUploadedCasFile = false;
    this.isFileStatusProceed = false;
    this.shouldShowSaveAndProceed = true;
    this.getClientCASFileDetailData();
  }


  openFolio(data) {
    const dialogRef = this.dialog.open(SelectFolioMapComponent, {
      width: '663px',

      data: { selectedFolios: data, type: 'casFileUpload' }
    });


    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result && 'selectedFamilyMemberData' in result) {
        this.mapInvestor(result.selectedFamilyMemberData, 'multiple', null);
      }
    });
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
                this.uploadFileStatusMsg = 'Error, Please import file again';
                this.isFileStatusProceed = false;
                this.showPointsIfRefreshed = true;
                break;

              case 0:
                this.uploadFileStatusMsg = 'In Queue';
                this.isFileStatusProceed = false;
                break;

              case 1:
                this.uploadFileStatusMsg = 'File Imported';
                this.setCasFileObject(res);
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
    if (
      this.dataSource.data.every(item => item['isMapped'] == true) &&
      this.dataSource2.data.every(item => item['isMapped'] == true)
    ) {
      let data = {
        id: this.currentCasFileObject.id,
        processStatus: 2
      }

      //     id of selected cas log obj,
      // processStatus 2 for Data processed after completion of all mapping
      this.cusService.putCasFileStatusUpdate(data)
        .subscribe(res => {
          if (res) {
            console.log(res);
            this.close();
          }
        }, err => {
          console.log(err);
          this.eventService.openSnackBar('Something went wrong!', "DISMISS");
        })
    } else {
      this.eventService.openSnackBar("Some are still unmapped");
    }
  }

  changeMatTabIndex() {
    this.matTabIndex += 1;
    if (this.matTabIndex > 3) {
      this.matTabIndex = 0;
    }
    this.shouldShowSaveAndProceed = (this.matTabIndex === 2) ? false : true;
    this.shouldShowSaveAndProceed = (this.investorUnmappedCount === 0 && this.transactionUnmappedCount === 0) ? false : true;
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