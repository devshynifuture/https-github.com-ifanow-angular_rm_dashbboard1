import { AuthService } from './../../../../../auth-service/authService';
import { SupportService } from './../../support.service';
import { ExcelService } from './../../../customers/component/customer/excel.service';
import { ConfirmDialogComponent } from './../../../common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from './../../../../../Data-service/event.service';
import { UtilService } from './../../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { ReconciliationDetailsViewComponent } from '../reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ReconciliationService } from '../../../AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';


@Component({
  selector: 'app-upper-slider-backoffice',
  templateUrl: './upper-slider-backoffice.component.html',
  styleUrls: ['./upper-slider-backoffice.component.scss'],
})
export class UpperSliderBackofficeComponent implements OnInit {

  displayedColumns: string[] = ['doneOne', 'totalfolios', 'before_recon', 'after_recon', 'aum_balance', 'transaction', 'export_folios'];
  displayedColumns1: string[] = ['name', 'folioNumber', 'unitsIfanow', 'unitsRta', 'difference', 'transactions'];
  displayedColumns3: string[] = ['folios', 'fileOrderDateTime', 'status', 'referenceId', 'transactionAddedInFiles', 'transactionAdded', 'fileName', 'fileUrl'];

  dataSource = new MatTableDataSource(ELEMENT_DATA); // summary table
  dataSource1 = new MatTableDataSource(ELEMENT_DATA1); // manual recon all folio table
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2); // manual recon duplicate folio table
  dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3); // delete and reorder table
  isFranklinTab: boolean = false;
  isTabDisabled: boolean = true;

  data;
  brokerId;
  subTabState: number = 1;
  aumReconId: any = null;
  isLoading: boolean = false;
  aumList: any;
  mutualFundIds: any[] = [];
  advisorId = AuthService.getAdvisorId();

  rtId: any;
  didAumReportListGot: boolean = false;
  aumListReportValue: any[] = [];
  adminAdvisorIds: any[] = [];
  adminId = AuthService.getAdminId();
  parentId = AuthService.getParentId() ? AuthService.getParentId() : this.advisorId;
  isLoadingForDuplicate: boolean = false;
  canExportExcelSheet = 'false';
  rmId = AuthService.getRmId() ? AuthService.getRmId() : 0;
  upperHeaderName;
  isRmLogin: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private dialog: MatDialog,
    private supportService: SupportService,
    private datePipe: DatePipe,
    private reconService: ReconciliationService
  ) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId() ? AuthService.getAdvisorId() : this.data.advisorId;
    this.getRtaList();

  }

  rtaList = [];

  getRtaList() {
    this.reconService.getRTListValues({})
      .subscribe(res => {
        if (res && res.length !== 0) {
          res.forEach(element => {
            if (element.name !== 'SUNDARAM' && element.name !== 'PRUDENT' && element.name !== 'NJ_NEW' && element.name !== 'NJ') {
              this.rtaList.push({
                name: element.name == 'FRANKLIN_TEMPLETON' ? 'FRANKLIN' : element.name,
                value: element.id,
                type: 'rta'
              });
            }
          });

          this.upperHeaderName = this.getRtName(this.data.rtId);
          this.teamMemberListGet();
        } else {
          this.eventService.openSnackBar("Error In Fetching RTA List", "Dismiss");
        }
      });
  }

  getRtName(id) {
    let obj = this.rtaList.find(c => c.value == id);
    return obj.name;
  }

  handlingDataVariable() {
    if (this.data) {
      this.aumReconId = this.data.id;
      this.brokerId = this.data.brokerId;
    }

    if (this.data.startRecon) {
      this.rtId = this.data.rtId;
      this.isFranklinTab = (this.getRtName(this.rtId) === "FRANKLIN_TEMPLETON") ? true : false;

      console.log('start recon is true::::');
      this.isLoading = true;
      this.getBackofficeAumReconListSummary(true);
      this.dataSource3.data = null;

    } else if (this.data.startRecon === false) {
      this.rtId = this.data.rtId;
      console.log('start recon is false::::');
      this.bindDataWithSummaryTable();
      this.getAumReportList();
      this.getBackofficeAumFileOrderListDeleteReorder();

    }
    console.log("this is data that we got from franklin:::::::", this.data);
  }

  teamMemberListGet() {
    this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          console.log("team members: ", data)
          data.forEach(element => {
            this.adminAdvisorIds.push(element.adminAdvisorId);
          });

          this.handlingDataVariable();
        } else {
          this.adminAdvisorIds = [this.advisorId];
          this.handlingDataVariable();
          this.eventService.openSnackBar('No Team Member Found', "Dismiss");
        }
      })
  }

  bindDataWithSummaryTable() {
    let objArr = [];
    objArr = [{
      doneOne: this.data.doneOn,
      aum_balance: this.data.aumBalanceDate,
      transaction: this.data.transactionDate,
      export_folios: '',
      totalfolios: this.data.totalFolioCount,
      before_recon: this.data.unmatchedCountBeforeRecon,
      after_recon: this.data.unmatchedCountAfterRecon
    }];

    console.log(objArr);
    this.dataSource.data = objArr;
  }

  getDataFromObsAfterDeletingTransacn() {
    console.log("updoate ifanow units function called");
    this.supportService.getDataThroughObs().subscribe(res => {
      console.log("this is something coming from obs:::::::::::", res);
      if (res !== '') {
        // update units ifanow
        console.log("this is response that im getting::::", res);
        this.dataSource1.data.map(item => {
          item['unitsIfanow'] = String((res.units).toFixed(3));
          item['difference'] = String((parseInt(item['unitsIfanow']) - parseInt(item['unitsRta'])).toFixed(3));
        });
        this.getBackofficeAumReconListSummary(false);
        this.getDuplicateFolioList();
      }
    })
  }

  getBackofficeAumReconListSummary(doStartRecon) {
    this.isRmLogin = AuthService.getUserInfo().isRmLogin;
    let isParent = (this.isRmLogin) ? true : (this.parentId === this.advisorId) ? true : false;
    const data = {
      advisorIds: [...this.adminAdvisorIds],
      brokerId: this.brokerId,
      rt: this.data.rtId,
      parentId: (this.adminId && this.adminId == 0) ? this.advisorId : (this.parentId ? this.parentId : this.advisorId),
      isParent,
    }

    console.log(data);
    // 
    this.supportService.getAumReconListGetValues(data)
      .subscribe(res => {
        this.isLoading = false;
        let objArr = [];
        console.log("this is summary values::::", res);
        if (res && res['aumList']) {
          this.canExportExcelSheet = 'true';
          this.aumList = res['aumList'];
          let arrayValue = [];

          let filteredAumListWithIsMappedToMinusOne = this.aumList.filter(element => {
            return element.isMapped === -1;
          });
          filteredAumListWithIsMappedToMinusOne.forEach(element => {
            // check  and compare date object and can delete value
            arrayValue.push({
              name: element.shemeName,
              folioNumber: element.folioNumber,
              unitsIfanow: element.calculatedUnits.toFixed(3),
              unitsRta: (element.aumUnits).toFixed(3),
              difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
              transaction: '',
              mutualFundId: element.mutualFundId,
              canDeleteTransaction: new Date(res.transactionDate).getTime() > new Date(element.freezeDate).getTime(),
              freezeDate: element.freezeDate ? element.freezeDate : null
            });
          });
          this.dataSource1.data = arrayValue;

          // console.log("datas available till now:::::", this.data, res);
          const data = {
            advisorId: this.advisorId,
            brokerId: this.brokerId,
            totalFolioCount: res.totalFolioCount,
            matchedCount: res.mappedCount,
            aumBalanceDate: res.aumList[0].aumDate,
            unmatchedCountBeforeRecon: res.unmappedCount,
            transactionDate: res.transactionDate,
            rtId: this.data.rtId,
            // when rm login is creted this will get value from localStorage
            rmId: this.rmId
          }
          if (doStartRecon) {
            this.reconService.putBackofficeReconAdd(data)
              .subscribe(res => {
                console.log("started reconciliation::::::::::::", res);
                if (this.data.startRecon) {
                  this.aumReconId = res;
                }
              }, err => {
                console.error(err);
              });
          }

          // aum date for all object is the same 
          objArr = [{
            doneOne: new Date().getMilliseconds(),
            aum_balance: res.aumList[0].aumDate,
            transaction: res.transactionDate,
            export_folios: '',
            totalfolios: res.totalFolioCount,
            before_recon: res.unmappedCount,
            after_recon: res.unmappedCount
          }];

          res.aumList.forEach(element => {
            this.mutualFundIds.push(element.mutualFundId);
          });
        } else {
          this.canExportExcelSheet = 'false';
          this.dataSource1.data = null;
          objArr = null;
        }
        this.dataSource.data = objArr;
      });
  }

  getDuplicateFolioList() {
    let data;
    if (this.data.flag == 'report') {
      let mutualFundIds = [];
      this.aumListReportValue.forEach(element => {
        mutualFundIds.push(element.mutualFundId);
      });
      data = {
        advisorIds: [this.advisorId],
        folio: mutualFundIds
      }
    } else {
      data = {
        advisorIds: [... this.adminAdvisorIds],
        folio: this.mutualFundIds
      }
    }
    if (this.didAumReportListGot) {
      this.isLoadingForDuplicate = true;
      this.reconService.getDuplicateFolioDataValues(data)
        .subscribe(res => {
          this.isLoadingForDuplicate = false;
          if (res) {
            console.log("this is some duplicate values:::::::::", res, this.aumList);
            let filteredArrValue = [];
            let arrValue = [];
            if (this.data.flag === 'report') {
              res.forEach(element => {
                filteredArrValue = this.aumListReportValue.filter(item => {
                  return item.mutualFundId === element.id ? item : null;
                });
              });
            } else {
              res.forEach(element => {
                filteredArrValue = this.aumList.filter(item => {
                  return item.mutualFundId === element.id ? item : null;
                });
              });
            }


            console.log("htis is filered value::::", filteredArrValue);
            filteredArrValue.forEach(item => {
              arrValue.push({
                id: item.id,
                name: item.shemeName,
                folioNumber: item.folioNumber,
                mutualFundId: item.mutualFundId,
                advisorId: item.advisorId,
                brokerId: item.broker_id,
                unitsRta: (item.aumUnits).toFixed(3),
                unitsIfanow: (item.calculatedUnits).toFixed(3),
                difference: (item.calculatedUnits - item.aumUnits).toFixed(3),
                freezeDate: item.freezeDate ? item.freezeDate : null,
                isMapped: item.isMapped,
                aumDate: item.aumDate,
                brokerCode: item.brokerCode,
                schemeCode: item.schemeCode,
                mutualFundTransaction: item.mutualFundTransaction,
                transactions: ''
              })
            })
            this.dataSource2.data = arrValue;
          } else {
            this.dataSource2.data = null;
          }

        }, err => {
          console.error(err);
        });
    } else {
      this.eventService.openSnackBar("No Aum Report List Found", "Dismiss");
      this.dataSource2.data = null;
    }
  }

  retryFileOrder() {
    const data = {
      id: this.aumReconId,
      rtId: this.data.rtId
    };
    this.reconService.putFileOrderRetry(data)
      .subscribe(res => {
        console.log("retried values:::::::", res);

        if (res === 1) {
          this.getBackofficeAumFileOrderListDeleteReorder();
        }
      }, err => {
        console.error(err);
      })
  }

  deleteAndReorder() {
    const data = {
      id: this.aumReconId,
      brokerId: this.brokerId,
      advisorIds: [this.advisorId],
      rtId: this.data.rtId,
      mutualFundIds: this.mutualFundIds,
      parentId: this.parentId,
      isParent: (this.parentId === this.advisorId) ? true : false
    }
    console.log("this is requestjson for delete and reorder:::: ", data)
    this.reconService.deleteAndReorder(data)
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.error(err);
      })
  }

  getBackofficeAumFileOrderListDeleteReorder() {
    this.isLoading = true;
    this.supportService.getBackofficeAumOrderListValues({ aumReconId: this.aumReconId })
      .subscribe(res => {
        this.isLoading = false;
        console.log(res);
        if (res) {
          res.map(element => {
            if (element && element.folios !== '') {
              let obj = {
                count: element.folios.split(',').length,
                file: new Blob([element.folios], { type: "text/plain" })
              }
              element.folios = obj;
            }
            return element;
          });

          res.map(item => {
            if (!item.hasOwnProperty('fileOrderDateTime')) {
              item.fileOrderDateTime = '-'
            }
            if (!item.hasOwnProperty('referenceId')) {
              item.referenceId = '-'
            }
            if (!item.hasOwnProperty('transactionAddedInFiles')) {
              item.transactionAddedInFiles = '-'
            }
            if (!item.hasOwnProperty('transactionAdded')) {
              item.transactionAdded = '-'
            }
            if (!item.hasOwnProperty('fileName')) {
              item.fileName = '-'
            }
            item.fileUrl && item.fileUrl !== '' ? item.fileUrl : null;
          })

          console.log("deleted reorder values::::", res);
          this.dataSource3.data = res;
        } else {
          this.dataSource3.data = null;
        }
      });
  }

  saveFile(blob) {
    const userData = AuthService.getUserInfo();
    saveAs(blob, userData.fullName + '-' + 'ordered-folios' + '.txt');
  }

  exportToExcelSheet(value, element) {
    this.isTabDisabled = false;
    this.isFranklinTab = this.getRtName(this.data.rtId) === 'FRANKLIN_TEMPLETON' ? true : false;


    // creation of excel sheet 
    let headerData = [
      { width: 20, key: 'Investor Name' },
      { width: 20, key: 'Asset Id' },
      { width: 25, key: 'Scheme Name' },
      { width: 18, key: 'Scheme Code' },
      { width: 18, key: 'Folio Number' },
      { width: 18, key: 'RTA Type' },
      { width: 18, key: 'IFANOW Units' },
      { width: 15, key: 'RTA Units' },
      { width: 10, key: 'RTA Bal as on' },
      { width: 10, key: 'Unit Difference' },
      { width: 10, key: 'Amount Difference' }
    ];
    let excelData = [];
    let footer = [];
    let header = [
      'Investor Name',
      'Asset Id',
      'Scheme Name',
      'Scheme Code',
      'Folio Number',
      'RTA Type',
      'IFANOW Units',
      'RTA Units',
      'RTA Bal as on',
      'Unit Difference',
      'Amount Difference'
    ];
    if (this.aumList) {
      let rtName = this.getRtName(this.data.rtId);
      this.aumList.forEach(element => {
        let data = [
          element.investorName ? element.investorName : '-',
          element.mutualFundId ? element.mutualFundId : '-',
          element.shemeName ? element.shemeName : '-',
          element.schemeCode ? element.schemeCode : '-',
          element.folioNumber ? element.folioNumber : '-',
          rtName,
          element.calculatedUnits ? element.calculatedUnits : '-',
          element.aumUnits ? element.aumUnits : '-',
          element.aumDate ? this.datePipe.transform(element.aumDate) : '-',
          element.calculatedUnits && element.aumUnits ? element.calculatedUnits - element.aumUnits : '-',
          'amt difference',
        ]

        excelData.push(Object.assign(data));
      });
      ExcelService.exportExcel(headerData, header, excelData, footer, value);
    } else {
      if (this.didAumReportListGot && this.aumListReportValue.length !== 0) {
        let rtName = this.getRtName(this.data.rtId);
        this.aumListReportValue.forEach(element => {
          let data = [
            element.investorName ? element.investorName : '-',
            element.mutualFundId ? element.mutualFundId : '-',
            element.shemeName ? element.shemeName : '-',
            element.schemeCode ? element.schemeCode : '-',
            element.folioNumber ? element.folioNumber : '-',
            rtName,
            element.calculatedUnits ? element.calculatedUnits : '-',
            element.aumUnits ? element.aumUnits : '-',
            element.aumDate ? this.datePipe.transform(element.aumDate) : '-',
            element.calculatedUnits && element.aumUnits ? element.calculatedUnits - element.aumUnits : '-',
            'amt difference',
          ]
          excelData.push(Object.assign(data))
        });
        ExcelService.exportExcel(headerData, header, excelData, footer, value);
      } else {
        this.eventService.openSnackBar("No Aum Report List Found", "Dismiss")
      }
    }

  }

  openReconciliationDetails(value, data, tableType, index, freezeDate) {
    let tableData = [];
    if (tableType === 'all-folios') {
      if (this.data.flag === 'report') {
        tableData = this.aumListReportValue[index].mutualFundTransaction;
      } else {
        tableData = this.aumList[index].mutualFundTransaction;
      }
    }
    if (tableType === 'duplicate-folios') {
      if (this.data.flag === 'report') {
        // tableData = this.aumListReportValue;
      } else {
        tableData = data.mutualFundTransaction
      }
    }
    const fragmentData = {
      flag: value,
      data: { ...data, tableType, tableData, brokerId: this.brokerId, rtId: this.rtId, freezeDate },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: is refresh Required??? ', sideBarData);

            if (sideBarData.refreshRequired) {
              this.getDataFromObsAfterDeletingTransacn();
            }
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openDeleteDialog() {
    const dialogData = {
      header: 'DELETE UNMATCHED FOLIOS?',
      body: 'Are you sure you want to delete the unmatched folios?',
      body2: '',
      btnYes: 'CANCEL',
      btnNo: 'YES',
      positiveMethod: () => {
        console.log('successfully deleted');
        // this.deleteAndReorder();
        this.deleteUnfreezeTransaction();
        dialogRef.close();
      },
      negativeMethod: () => {
        console.log('aborted');
      }

    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  deleteUnfreezeTransaction() {
    let data = {
      id: this.data.id,
      advisorIds: [this.advisorId],
      parentId: this.parentId,
      isParent: (this.parentId === this.advisorId) ? true : false,
      brokerId: this.brokerId,
      rtId: this.rtId,
      mutualFundIds: this.mutualFundIds
    }

    this.reconService.deleteUnfreezeTransaction(data)
      .subscribe(res => {
        console.log("this is delete unfreeze transaction:::", res);
      }, err => {
        console.error(err)
      })

  }

  getAumReportList() {
    let data = {
      aumReconId: this.data.id
    };
    this.isLoading = true;
    this.canExportExcelSheet = 'intermediate';
    this.reconService.getAumReportListValues(data)
      .subscribe(res => {
        this.isLoading = false;
        console.log("this is aum report list get:::", res);
        if (res) {
          this.didAumReportListGot = true;
          this.canExportExcelSheet = 'true';
          console.log("this is aum report list get:::", res);
          let arrayValue = [];
          this.aumListReportValue = res;
          res.forEach(element => {
            arrayValue.push({
              name: element.shemeName,
              folioNumber: element.folioNumber,
              unitsIfanow: element.calculatedUnits.toFixed(3),
              unitsRta: (element.aumUnits).toFixed(3),
              difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
              transaction: '',
              mutualFundId: element.mutualFundId,
              canDeleteTransaction: new Date(element.transactionDate).getTime() > new Date(element.freezeDate).getTime()
            });
          });
          this.dataSource1.data = arrayValue;
        } else {
          this.canExportExcelSheet = 'false';
          this.didAumReportListGot = false;
          this.dataSource1.data = null;
        }
      }, err => {
        console.error(err)
      })
  }

  postReqForBackOfficeUnmatchedFolios() {
    const data = [];
    if (this.aumList) {
      this.aumList.forEach(element => {
        data.push({
          advisorId: this.advisorId,
          aumReconId: this.aumReconId,
          mutualFundId: element.mutualFundId,
          aumUnits: element.aumUnits,
          mutualFundUnits: element.calculatedUnits,
          aumDate: this.datePipe.transform(element.aumDate, 'yyyy-MM-dd'),
        })
      });

      console.log("this is what we are sending to post req::", data);

      // need to discuss with ajay
      this.reconService.postBackOfficeUnmatchedFoliosData(data)
        .subscribe(res => {
          console.log(" backoffice unmateched Folio, post ", res);
        }, err => {
          console.error(err);
        })
    }

  }

  dialogClose() {
    console.log('this is clicked');
    // post call
    this.postReqForBackOfficeUnmatchedFolios();

    this.eventService.changeUpperSliderState({ state: 'close', refreshRequired: true });
  }

  setSubTabState(state) {
    this.subTabState = state;
    if (this.subTabState === 2) {
      this.getDuplicateFolioList();
    }
  }

  openDeleteAndReorderDialog() {
    if (!this.isFranklinTab) {
      const dialogData = {
        header: 'DELETE & REORDER?',
        body: 'Are you sure you want to delete and reorder the unmatched folios?',
        body2: '',
        btnYes: 'CANCEL',
        btnNo: 'YES',
        positiveMethod: () => {
          console.log('successfully deleted');
          this.deleteAndReorder();
          dialogRef.close();
        },
        negativeMethod: () => {
          console.log('aborted');
        }

      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: dialogData,
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {

      });

    }
  }

}

interface PeriodicElement {
  doneOne: string;
  totalfolios: string;
  before_recon: string;
  after_recon: string;
  aum_balance: string;
  transaction: string;
  export_folios: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { doneOne: '', totalfolios: '', before_recon: '', after_recon: '', aum_balance: '', transaction: '', export_folios: '' },
  { doneOne: '', totalfolios: '', before_recon: '', after_recon: '', aum_balance: '', transaction: '', export_folios: '' },
  { doneOne: '', totalfolios: '', before_recon: '', after_recon: '', aum_balance: '', transaction: '', export_folios: '' },
];



interface PeriodicElement1 {
  name: string;
  folioNumber: string;
  unitsIfanow: string;
  unitsRta: string;
  difference: string;
  transactions: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
];

const ELEMENT_DATA2: PeriodicElement1[] = [
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
  { name: '', folioNumber: '', unitsIfanow: '', unitsRta: '', difference: '', transactions: '' },
];

interface PeriodicElement3 {
  folios: string;
  fileOrderDateTime: string;
  status: string;
  referenceId: string;
  transactionAddedInFiles: string;
  transactionAdded: string;
  fileName: string;
  fileUrl: string;

}
const ELEMENT_DATA3: PeriodicElement3[] = [
  { folios: '', fileOrderDateTime: '', status: '', referenceId: '', transactionAddedInFiles: '', transactionAdded: '', fileName: '', fileUrl: '' },
  { folios: '', fileOrderDateTime: '', status: '', referenceId: '', transactionAddedInFiles: '', transactionAdded: '', fileName: '', fileUrl: '' },
  { folios: '', fileOrderDateTime: '', status: '', referenceId: '', transactionAddedInFiles: '', transactionAdded: '', fileName: '', fileUrl: '' },
];