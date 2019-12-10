import { AddPoTdComponent } from './../common-component/add-po-td/add-po-td.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { DetailedPoTdComponent } from './detailed-po-td/detailed-po-td.component';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
import { FormatNumberDirective } from 'src/app/format-number.directive';
@Component({
  selector: 'app-po-td-scheme',
  templateUrl: './po-td-scheme.component.html',
  styleUrls: ['./po-td-scheme.component.scss'],

})
export class PoTdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  footer =[];
  isLoading: boolean = true;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns22 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'tenure', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = 2978;
    this.getPoTdSchemedata();
  }
  async ExportTOExcel(value) {
    this.excelData = []
    var data = []
    var headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 20, key: 'Amount Invested' },
    { width: 20, key: 'Tenure' },
    { width: 20, key: 'Maturity Value' },
    { width: 20, key: 'Maturity Date' },
    { width: 25, key: 'TD Number' },
    { width: 15, key: 'Description' },
    { width: 15, key: 'Status' },]
    var header = ['Owner', 'Current Value', 'Rate', 'Amount Invested',
      'Tenure', 'Maturity Value', 'Maturity Date', 'TD Number', 'Description','Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, (element.currentValue), (element.rate), (element.balance),
      new Date(element.balanceAsOn), element.description, element.status]
      this.excelData.push(Object.assign(data))
    });
    var footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(), '',
      this.formatNumber.first.formatAndRoundOffNumber(), '', '','',]
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
  getPoTdSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemePOTDData(obj).subscribe(
      data => this.getPoTdSchemedataResponse(data)
    )
  }
  getPoTdSchemedataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data.postOfficeTdList.length != 0) {
      this.datasource = new MatTableDataSource(data.postOfficeTdList);
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData)
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
        this.cusService.deletePOTD(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("POSAVING is deleted", "dismiss")
            dialogRef.close();
            this.getPoTdSchemedata();
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

  openDetailPOTD(data) {

    console.log('this is detailed potd data', data);
    const fragmentData = {
      flag: 'detailPoTd',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPoTdSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddPOTD(data) {
    const fragmentData = {
      flag: 'addPoTd',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoTdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPoTdSchemedata()
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
