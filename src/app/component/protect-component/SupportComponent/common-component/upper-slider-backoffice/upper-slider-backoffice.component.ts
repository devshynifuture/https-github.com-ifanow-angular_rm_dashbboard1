import { ExcelService } from './../../../customers/component/customer/excel.service';
import { ConfirmDialogComponent } from './../../../common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from './../../../../../Data-service/event.service';
import { UtilService } from './../../../../../services/util.service';
import { Component, OnInit } from '@angular/core';
import { ReconciliationDetailsViewComponent } from '../reconciliation-details-view/reconciliation-details-view.component';
import { SubscriptionInject } from '../../../AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-upper-slider-backoffice',
  templateUrl: './upper-slider-backoffice.component.html',
  styleUrls: ['./upper-slider-backoffice.component.scss']
})
export class UpperSliderBackofficeComponent implements OnInit {

  displayedColumns: string[] = ['doneOne', 'totalfolios', 'before_recon', 'after_recon', 'aum_balance', 'transaction', 'export_folios'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['name', 'folioNumber', 'unitsIfnow', 'unitsRta', 'difference', 'transactions'];
  dataSource1 = ELEMENT_DATA1;
  dataSource2 = ELEMENT_DATA2;

  displayedColumns3: string[] = ['foliosOrdered', 'file_order', 'file_status', 'id', 'trx_file', 'trx_added', 'file_name', 'download'];
  dataSource3 = ELEMENT_DATA3;
  isTabDisabled: boolean = true;

  subTabState: number = 1;

  constructor(private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }


  // async ExportTOExcel(value) {
  //   this.excelData = [];
  //   let data = [];
  //   var headerData = [{ width: 20, key: 'Owner' },
  //   { width: 20, key: 'Account type' },
  //   { width: 25, key: 'Balance as on' },
  //   { width: 18, key: 'Rate' },
  //   { width: 18, key: 'Balance mentioned' },
  //   { width: 18, key: 'Account number' },
  //   { width: 18, key: 'Bank name' },
  //   { width: 15, key: 'Description' },
  //   { width: 10, key: 'Status' }];
  //   var header = ['Owner', 'Account type', ' Balance as on', 'Description', 'Status'];

  //   if (value == 'Cash in hand') {
  //     headerData = [
  //       { width: 20, key: 'Owner' },
  //       { width: 20, key: 'Account type' },
  //       { width: 25, key: 'Balance as on' },
  //       { width: 15, key: 'Description' },
  //       { width: 10, key: 'Status' },
  //     ];
  //     this.cashInHandList.filteredData.forEach(element => {
  //       data = [element.ownerName, (element.accountType), (element.balanceAsOn),
  //       element.description, element.status];
  //       this.excelData.push(Object.assign(data));
  //     });
  //     const footerData = [
  //       'Total',
  //       this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCashValue),
  //       '',
  //       '', ,
  //       ''
  //     ];
  //     this.footer.push(Object.assign(footerData));
  //   } else {

  //     header = [
  //       'Owner',
  //       'Account type',
  //       'Balance as on',
  //       'Rate',
  //       'Balance mentioned',
  //       'Account number',
  //       'Bank name',
  //       'Description',
  //       'Status'
  //     ];
  //     this.bankAccountList.filteredData.forEach(element => {
  //       data = [
  //         element.ownerName,
  //         (element.accountType == 1) ? 'Current' : 'Savings',
  //         new Date(element.balanceAsOn),
  //         (element.interestRate),
  //         this.formatNumber.first.formatAndRoundOffNumber(element.accountBalance),
  //         (element.account),
  //         element.bankName,
  //         element.description,
  //         element.status
  //       ];
  //       this.excelData.push(Object.assign(data));
  //     });
  //     const footerData = ['Total', '', '', '', this.formatNumber.first.formatAndRoundOffNumber(this.totalAccountBalance), '', '', '', ''];
  //     this.footer.push(Object.assign(footerData));
  //   }
  //   ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  // }

  exportToExcelSheet(value) {
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
    ExcelService.exportExcel(headerData, header, excelData, footer, value);
  }

  openReconciliationDetails(value, data, tableType) {
    const fragmentData = {
      flag: value,
      data: { ...data, tableType },
      id: 1,
      state: 'open',
      componentName: ReconciliationDetailsViewComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            console.log('this is sidebardata in subs subs 3 ani: ', sideBarData);

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

export interface PeriodicElement {
  doneOne: string;
  totalfolios: string;
  before_recon: string;
  after_recon: string;
  aum_balance: string;
  transaction: string;
  export_folios: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { doneOne: '08/01/20 11:28AM', totalfolios: '890', before_recon: '14', after_recon: '0', aum_balance: '07/01/2020', transaction: '08/01/2020', export_folios: ' ' },
];



export interface PeriodicElement1 {
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



export interface PeriodicElement3 {
  foliosOrdered: string;
  file_order: string;
  file_status: string;
  id: string;
  trx_file: string;
  trx_added: string;
  file_name: string;
  download: string;

}
const ELEMENT_DATA3: PeriodicElement3[] = [
  { foliosOrdered: 'IIFL Dividend Opportunities Index Fund - Growth', file_order: '7716853/43	', file_status: '0', id: '463.820', trx_file: '463.82', trx_added: ' ', file_name: '', download: '' },
];