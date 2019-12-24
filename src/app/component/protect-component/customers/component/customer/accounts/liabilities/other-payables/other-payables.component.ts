import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ViewChildren } from '@angular/core';
import { CustomerService } from '../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { DetailedViewOtherPayablesComponent } from '../detailed-view-other-payables/detailed-view-other-payables.component';
import { AddOtherPayablesComponent } from '../add-other-payables/add-other-payables.component';
import * as _ from 'lodash';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../excel.service';

@Component({
  selector: 'app-other-payables',
  templateUrl: './other-payables.component.html',
  styleUrls: ['./other-payables.component.scss']
})
export class OtherPayablesComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
   
  displayedColumns = ['no', 'name', 'dateOfReceived', 'creditorName', 'amountBorrowed', 'interest', 'dateOfRepayment', 'outstandingBalance', 'description', 'status', 'icons'];
  // dataSource = ELEMENT_DATA;
  advisorId: any;
  dataSource: any;
  @Input() payableData;
  @Output() OtherDataChange = new EventEmitter();
  totalAmountBorrowed=0;
  totalAmountOutstandingBalance=0;
  excelData: any[];
  footer=[];
  constructor(public custmService:CustomerService,public util:UtilService,public subInjectService:SubscriptionInject,public eventService:EventService,public dialog:MatDialog) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.dataSource = this.payableData;
    this.dataSource = new MatTableDataSource(this.payableData);
    this.dataSource.sort = this.sort;
    // this.totalAmountBorrowed = _.sumBy(this.payableData, function (o) {
    //   return o.amountBorrowed;
    // });
    this.payableData.forEach(element => {
      this.totalAmountBorrowed+=element.amountBorrowed
    });
    // this.totalAmountOutstandingBalance = _.sumBy(this.payableData, function (o) {
    //   return o.outstandingBalance;
    // });
    this.payableData.forEach(element => {
      this.totalAmountOutstandingBalance +=element.outstandingBalance
    });
  }

  /**used for excel  */
  async ExportTOExcel(value) {
    this.excelData = []
    var data = []
    var headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Date of receipt' },
    { width: 20, key: 'Creditor name' },
    { width: 18, key: 'Amount borrowed' },
    { width: 18, key: 'Interest' },
    { width: 18, key: 'Date of repayment' },
    { width: 25, key: 'Outstanding balance' },
    { width: 18, key: 'Description' },
    { width: 10, key: 'Status' },]
    var header = ['Owner', 'Date of receipt','Creditor name', 'Amount borrowed',
      'Interest', 'Date of repayment', 'Outstanding balance', 'Description', 'Status'];
    this.dataSource.filteredData.forEach(element => {
      data = [element.ownerName, new Date(element.dateOfReceived),element.creditorName,this.formatNumber.first.formatAndRoundOffNumber(element.amountBorrowed)
        , element.interest, new Date(element.dateOfRepayment),this.formatNumber.first.formatAndRoundOffNumber(element.outstandingBalance),
      element.description,element.status]
      this.excelData.push(Object.assign(data))
    });
    var footerData = ['Total','','', this.formatNumber.first.formatAndRoundOffNumber(this.totalAmountBorrowed),'', '', this.formatNumber.first.formatAndRoundOffNumber(this.totalAmountOutstandingBalance), '', '']
    this.footer.push(Object.assign(footerData))
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value)
  }
  getPayables() {
    let obj = {
      'advisorId': this.advisorId,
      'clientId': 2978
    }
    this.custmService.getOtherPayables(obj).subscribe(
      data => this.getOtherPayablesRes(data)
    );
  }
  getOtherPayablesRes(data) {
    console.log(data);
    this.dataSource = data;
    this.OtherDataChange.emit(this.dataSource);

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
        this.custmService.deleteOtherPayables(data.id).subscribe(
          data => {
            this.eventService.openSnackBar("Other payables is deleted", "dismiss")
            dialogRef.close();
            this.getPayables();
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
  open(flagValue, data) {
    const fragmentData = {
      flag: flagValue,
      data: data,
      id: 1,
      state: 'open',
      componentName: AddOtherPayablesComponent

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        this.getPayables();
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  openDetailedView(data) {
    const fragmentData = {
      flag: 'openOtherPayables',
      data: data,
      id: 1,
      state: 'open35',
      componentName: DetailedViewOtherPayablesComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
export interface PeriodicElement {
  no: string;
  name: string;
  dateOfReceived: string;
  creditorName: string;
  amountBorrowed: string;
  interest: string;
  dateOfRepayment: string;
  outstandingBalance: string;
  description: string;
  status: string;

}

