import { AddScssComponent } from './../common-component/add-scss/add-scss.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { EventService } from 'src/app/Data-service/event.service';
import { DetailedScssComponent } from './detailed-scss/detailed-scss.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class ScssSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;
  scssData: any;
  sumOfQuarterlyPayout: number;
  sumOfTotalAmountReceived: number;
  sumOfAmountInvested: number;
  footer =[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getScssSchemedata()
  }

async ExportTOExcel(value) {
  this.excelData = []
  var data = []
  var headerData = [{ width: 20, key: 'Owner' },
  { width: 20, key: 'Quarterly Payout' },
  { width: 10, key: 'Rate'},
  { width: 20, key: 'Total Amount Recieved' },
  { width: 25, key: 'Amount Invested' },
  { width: 15, key: 'Maturity Date' },
  { width: 15, key: 'Description' },
  { width: 10, key: 'Status' },]
  var header = ['Owner', 'Quarterly Payout', 'Rate', 'Total Amount Recieved','Amount Invested',
   'Maturity Date', 'Description', 'Status'];
  this.datasource.filteredData.forEach(element => {
    data = [element.ownerName,(element.quarterlyPayout), (element.rate),this.formatNumber.first.formatAndRoundOffNumber(element.totalAmountReceived),
    this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested),(element.maturityValue), new Date(element.maturityDate),element.description, element.status]
    this.excelData.push(Object.assign(data))
  });
  var footerData = ['Total','', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfQuarterlyPayout),
    this.formatNumber.first.formatAndRoundOffNumber(this.sumOfTotalAmountReceived),
    this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', '']
  this.footer.push(Object.assign(footerData))
  this.exportExcel(headerData, header, this.excelData, this.footer,value)
}
async exportExcel(headerData, header, data, footer,value) {
  const wb = new Excel.Workbook()
  const ws = wb.addWorksheet()
  const meta1 = ws.getCell('A1')
  const meta2 = ws.getCell('A2')
  const meta3 = ws.getCell('A3')
  meta1.font = { bold: true }
  meta2.font = { bold: true }
  meta3.font = { bold: true }
  ws.getCell('A1').value = 'Type of report - ' + value;
  ws.getCell('A2').value = 'Client name - Rahul Jain';
  ws.getCell('A3').value = 'Report as on - ' + new Date();
  const head = ws.getRow(5)
  head.font = { bold: true }
  head.fill = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: {
      argb: '#f5f7f7'
    }
  };
  ws.getRow(5).values = header;
  ws.columns.alignment = { horizontal: 'left' };
  ws.columns = headerData
  data.forEach(element => {
    ws.addRow(element)
  });
  footer.forEach(element => {
    const last = ws.addRow(element)
    last.font = { bold: true }
  });
  const buf = await wb.xlsx.writeBuffer()
  saveAs(new Blob([buf]), 'Rahul Jain-' + value + '-' + new Date() + '.xlsx')
}
  getScssSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      requiredDate: ''
    }
    this.cusService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data)
    )
  }
  deleteModal(value, data) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete?',
      body2: 'This cannot be undone',
      btnYes: 'CANCEL',
      btnNo: 'DELETE',
      positiveMethod: () => {
        this.cusService.deleteSCSS(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("SCSS is deleted", "dismiss")
            dialogRef.close();
            this.getScssSchemedata();
          },
          err => this.eventService.openSnackBar(err)
        )
      },
      negativeMethod: () => {
        console.log('2222222222222222222222222222222222222');
      }
    };
    console.log(dialogData + '11111111111111');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getKvpSchemedataResponse(data: any) {
    console.log(data);
    this.isLoading = false;
    if (data.scssList.length != 0) {
      this.datasource = new MatTableDataSource(data.scssList);
      this.datasource.sort = this.sort;
      this.sumOfAmountInvested = data.sumOfAmountInvested;
      this.sumOfTotalAmountReceived = data.sumOfTotalAmountReceived;
      this.sumOfQuarterlyPayout = data.sumOfQuarterlyPayout;
      this.scssData = data;
    } else {
      this.noData = "No Scheme Found";
    }
  }
  openAddSCSS(data,flag) {
    const fragmentData = {
      flag: 'addSCSS',
      data,
      id: 1,
      state:(flag=="detailedScss")?'open35':'open',
      componentName:(flag=="detailedScss")?DetailedScssComponent:AddScssComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getScssSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
