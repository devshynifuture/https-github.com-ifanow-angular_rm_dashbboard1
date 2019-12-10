import { AddSsyComponent } from './../common-component/add-ssy/add-ssy.component';
import { Component, OnInit, ViewChild, ViewEncapsulation, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DetailedSsyComponent } from './detailed-ssy/detailed-ssy.component';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver'
import { FormatNumberDirective } from 'src/app/format-number.directive';

@Component({
  selector: 'app-ssy-scheme',
  templateUrl: './ssy-scheme.component.html',
  styles: [`
  kendo-pdf-export {
    font-family: 'Material Icons';
    font-size: 1px;
  }
`,
  ],
  encapsulation: ViewEncapsulation.None
})
export class SsySchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;
  ssyData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];

  constructor(public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private eventService: EventService) { }
  displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();;
    this.getSsySchemedata()
  }

  async ExportTOExcel(value) {
    this.excelData = []
    var data = []
    var headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 25, key: 'Total Amount Invested' },
    { width: 20, key: 'Account Number' },
    { width: 15, key: 'Maturity Date' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },]
    var header = ['Owner', 'Current Value', 'Rate', 'Total Amount Invested',
      'Account Number', 'Maturity Date', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
      this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested),(element.number), new Date(element.maturityDate),element.description, element.status]
      this.excelData.push(Object.assign(data))
    });
    var footerData = ['Total',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', '', '']
    this.footer.push(Object.assign(footerData))
    this.exportExcel(headerData, header, this.excelData, this.footer,value)
  }
  async exportExcel(headerData, header, data, footer,value) {
    const wb = new Excel.Workbook()
    const ws = wb.addWorksheet()
    //ws.mergeCells('A1', 'M1');
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
  getSsySchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => this.getSsySchemedataResponse(data),
      err => this.eventService.openSnackBar(err)
    )
  }
  getSsySchemedataResponse(data) {
    console.log(data);

    this.isLoading = false;
    if (data.SSYList.length != 0) {
      this.datasource = new MatTableDataSource(data.SSYList);
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData)
      this.sumOfCurrentValue = data.SumOfCurrentValue;
      this.sumOfAmountInvested = data.SumOfAmountInvested;
      this.ssyData = data;
    } else {
      this.noData = "No Scheme Found";
    }

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
        this.cusService.deleteSSY(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("SSY is deleted", "dismiss")
            dialogRef.close();
            this.getSsySchemedata();
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
  addOpenSSY(data, flag) {
    const fragmentData = {
      flag: 'addSyss',
      data,
      id: 1,
      state: (flag == "detailedSsy") ? 'open35' : 'open',
      componentName: (flag == "detailedSsy") ? DetailedSsyComponent : AddSsyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getSsySchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}