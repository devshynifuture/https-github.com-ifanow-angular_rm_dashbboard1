import { AddNscComponent } from './../common-component/add-nsc/add-nsc.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { DetailedNscComponent } from './detailed-nsc/detailed-nsc.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver'
import { ExcelService } from '../../../../excel.service';
@Component({
  selector: 'app-nsc-scheme',
  templateUrl: './nsc-scheme.component.html',
  styleUrls: ['./nsc-scheme.component.scss']
})
export class NscSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading: boolean = true;
  nscData: any;
  sortedData: any;
  sumOfCurrentValue: number;
  sumOfMaturityValue: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;

  excelData: any[];
  footer

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) { }
  displayedColumns17 = ['no', 'owner', 'cvalue', 'rate', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource;
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = 2978;
    this.getNscSchemedata();
    this.footer  =[];
  }
  async ExportTOExcel(value) {
    this.excelData = []
    var data = []
    var headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 15, key: ' Maturity Value' },
    { width: 15, key: 'Maturity Date' },
    { width: 25, key: 'Certificate Number' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },]
    var header = ['Owner', 'Current Value', 'Rate', ' Maturity Value',
      'Maturity Date', 'Certificate Number', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName,  this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
         this.formatNumber.first.formatAndRoundOffNumber(element.maturityValue),new Date(element.maturityDate),element.certificateNumber, element.description, element.status]
      this.excelData.push(Object.assign(data))
    });
    var footerData = ['Total',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue),'',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMaturityValue), '', '', '' , '']
    this.footer.push(Object.assign(footerData))
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer,value)
  }
  getNscSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    }
    this.cusService.getSmallSavingSchemeNSCData(obj).subscribe(
      data => this.getNscSchemedataResponse(data)
    )
  }
  getNscSchemedataResponse(data) {
    console.log(data, "NSC");
    this.isLoading = false;
    if (data.NationalSavingCertificate.length != 0) {
      this.datasource = new MatTableDataSource(data.NationalSavingCertificate);
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData)
      this.sumOfMaturityValue = data.SumOfMaturityValue;
      this.sumOfCurrentValue = data.SumOfCurrentValue;
      this.nscData = data
    } else {
      this.noData = "No Scheme there"
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
        this.cusService.deleteNSC(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("NSC is deleted", "dismiss")
            dialogRef.close();
            this.getNscSchemedata();
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
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openAddNSC(data, flag) {
    const fragmentData = {
      flag: 'addNsc',
      data,
      id: 1,
      state: (flag == "detailedNsc") ? 'open35' : 'open',
      componentName: (flag == "detailedNsc") ? DetailedNscComponent : AddNscComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getNscSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}