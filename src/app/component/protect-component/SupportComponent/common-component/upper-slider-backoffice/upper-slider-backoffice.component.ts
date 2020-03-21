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
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  displayedColumns1: string[] = ['name', 'folioNumber', 'unitsIfnow', 'unitsRta', 'difference', 'transactions'];
  dataSource1 = new MatTableDataSource(ELEMENT_DATA1);
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);

  displayedColumns3: string[] = ['folios', 'fileOrderDateTime', 'status', 'referenceId', 'transactionAddedInFiles', 'transactionAdded', 'fileName', 'fileUrl'];
  dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3);
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

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private dialog: MatDialog,
    private supportService: SupportService,
    private datePipe: DatePipe,
    private reconService: ReconciliationService
  ) { }

  ngOnInit() {
    if (this.data) {
      this.aumReconId = this.data.id;
      this.brokerId = this.data.brokerId;
    }

    if (this.data.startRecon) {
      this.rtId = this.data.rtId
      console.log('start recon is true::::');
      this.isLoading = true;
      this.getBackofficeAumReconListSummary();

    } else if (this.data.startRecon === false) {
      console.log('start recon is false::::');
      this.dataSource.data = null;
      this.dataSource1.data = null;
      this.getBackofficeAumFileOrderListDeleteReorder();

    }
    console.log("this is data that we got:::::::", this.data);
  }

  getDataFromObsAfterDeletingTransacn() {
    console.log("updoate ifanow units function called");
    this.supportService.getDataThroughObs().subscribe(res => {
      console.log("this is something coming from obs:::::::::::", res);
      if (res !== '') {
        // update units ifanow
        console.log("this is response that im getting::::", res);
        this.dataSource1.data.map(item => {
          item['unitsIfnow'] = String((res.units).toFixed(3));
          item['difference'] = String((parseInt(item['unitsIfnow']) - parseInt(item['unitsRta'])).toFixed(3))
        })
      }
    })
  }

  getBackofficeAumReconListSummary() {
    const data = {
      advisorId: this.advisorId,
      brokerId: this.brokerId,
      rt: this.data.rtId
    }
    this.supportService.getAumReconListGetValues(data)
      .subscribe(res => {
        this.isLoading = false;
        let objArr = [];
        console.log("this is some table values::::", res);
        if (res && res['aumList']) {
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
              unitsIfnow: element.calculatedUnits.toFixed(3),
              unitsRta: (element.aumUnits).toFixed(3),
              difference: (element.calculatedUnits - element.aumUnits).toFixed(3),
              transaction: '',
              mutualFundId: element.mutualFundId,
              canDeleteTransaction: new Date(res.transactionDate).getTime() > new Date(element.freezeDate).getTime()
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
            rtId: this.data.rtId
          }
          this.reconService.putBackofficeReconAdd(data)
            .subscribe(res => {
              console.log("started reconciliation::::::::::::", res);
              if (this.data.startRecon) {
                this.aumReconId = res;
              }
            }, err => {
              console.error(err);
            })

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
          this.dataSource1.data = null;
          objArr = null;
        }
        this.dataSource.data = objArr;
      });
  }

  getDuplicateFolioList() {
    const data = {
      advisorId: this.advisorId,
      folio: this.mutualFundIds
    }
    console.log("this is some duplicate data values::::::::", data);
    this.reconService.getDuplicateFolioDataValues(data)
      .subscribe(res => {
        console.log("this is some duplicate values:::::::::", res);
        let arrValue = [];
        res.forEach(element => {
          arrValue = this.aumList.filter(item => {
            return item.mutualFundId === element.id ? item : null;
          });
        });
        console.log(this.aumList, arrValue);

        this.dataSource2.data = arrValue;
      }, err => {
        console.error(err);
      })
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
      advisorId: this.advisorId,
      rtId: this.data.rtId,
      mutualFundIds: this.mutualFundIds
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
    this.supportService.getBackofficeAumOrderListValues({ aumReconId: this.aumReconId })
      .subscribe(res => {
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
    this.aumList.forEach(element => {
      let data = [
        element.investorName,
        element.mutualFundId,
        element.shemeName,
        element.schemeCode,
        element.folioNumber,
        (this.data.rtId === 1 ? 'cams' : (this.data.rtId === 2 ? 'karvy' : (this.data.rtId === 3 ? 'franklin' : ''))),
        element.calculatedUnits,
        element.aumUnits,
        this.datePipe.transform(element.aumDate),
        element.calculatedUnits - element.aumUnits,
        'amt difference',
      ]

      excelData.push(Object.assign(data))
    });

    // ExcelService.exportExcel(headerData, header, excelData, footer, value);
  }

  openReconciliationDetails(value, data, tableType, index) {
    let tableData = [];
    if (tableType === 'all-folios') {
      tableData = this.aumList[index]['mutualFundTransaction'];
    }
    const fragmentData = {
      flag: value,
      data: { ...data, tableType, tableData, brokerId: this.brokerId, rtId: this.rtId },
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

  dialogClose() {
    console.log('this is clicked');
    this.eventService.changeUpperSliderState({ state: 'close' });
  }

  setSubTabState(state) {
    this.subTabState = state;
    if (this.subTabState === 2) {
      this.getDuplicateFolioList();
    }
  }

  openDeleteAndReorderDialog() {
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
  { name: 'IIFL Dividend Opportunities Index Fund - Growth', folioNumber: '7716853/43	', unitsIfanow: '0', unitsRta: '463.820', difference: '463.82', transactions: '5' },
  { name: 'IIFL Dividend Opportunities Index Fund - Growth', folioNumber: '7716853/43	', unitsIfanow: '0', unitsRta: '463.820', difference: '463.82', transactions: '5' },
];

const ELEMENT_DATA2: PeriodicElement1[] = [
  { name: 'HDFC Prudents Fund - Growth', folioNumber: '47471/80	', unitsIfanow: '520.90', unitsRta: '420.90', difference: '100.00', transactions: '6' },
  { name: 'HDFC Prudents Fund - Growth', folioNumber: '47471/80	', unitsIfanow: '520.90', unitsRta: '420.90', difference: '100.00', transactions: '6' },
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