import { DetailedPoRdComponent } from './detailed-po-rd/detailed-po-rd.component';
import { AddPoRdComponent } from './../common-component/add-po-rd/add-po-rd.component';
import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { UtilService } from 'src/app/services/util.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../excel.service';

@Component({
  selector: 'app-po-rd-scheme',
  templateUrl: './po-rd-scheme.component.html',
  styleUrls: ['./po-rd-scheme.component.scss']
})
export class PoRdSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = true;
  pordData: any;
  sumOfCurrentValue: number;
  sumOfMonthlyDeposit: number;
  sumOfMaturityValue: number;
  footer = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];

  constructor(public dialog: MatDialog, private eventService: EventService,
    private cusService: CustomerService, private subInjectService: SubscriptionInject) {
  }

  displayedColumns21 = ['no', 'owner', 'cvalue', 'rate', 'deposit', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  data: Array<any> = [{}, {}, {}];
  dataSource = new MatTableDataSource(this.data);

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getPoRdSchemedata();
  }


  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 20, key: 'Monthly Deposit' },
    { width: 20, key: 'Maturity Value' },
    { width: 20, key: 'Maturity Date' },
    { width: 20, key: 'RD Number' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Rate', 'Monthly Deposit',
      'Maturity Value', 'Maturity Date', 'RD Number', 'Description', 'Status'];
    this.dataSource.filteredData.forEach(element => {
      data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue),
      (element.rate), (element.deposit), this.formatNumber.first.formatAndRoundOffNumber(element.maturityValue),
      new Date(element.maturityDate), (element.rdNuumber), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMonthlyDeposit),
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfMaturityValue), '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getPoRdSchemedata() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
    };
    this.cusService.getSmallSavingSchemePORDData(obj).subscribe(
      data => this.getPoRdSchemedataResponse(data)
    );
  }

  getPoRdSchemedataResponse(data) {
    console.log(data);
    this.isLoading = false;
    if (data) {
      this.dataSource = new MatTableDataSource(data.postOfficeRDList);
      this.dataSource.sort = this.sort;
      UtilService.checkStatusId(this.dataSource.filteredData);
      this.sumOfCurrentValue = data.sumOfCurrentValue;
      this.sumOfMonthlyDeposit = data.sumOfMonthlyDeposit;
      this.sumOfMaturityValue = data.sumOfMaturityValue;
      this.pordData = data;
    } else {
      this.noData = 'No scheme found';
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
        this.cusService.deletePORD(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('PORD is deleted', 'dismiss');
            dialogRef.close();
            this.getPoRdSchemedata();
          },
          err => this.eventService.openSnackBar(err)
        );
      },
      negativeMethod: () => {
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

  openDetailedPoRd(data) {
    const fragmentData = {
      flag: 'detailPORD',
      data,
      id: 1,
      state: 'open35',
      componentName: DetailedPoRdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPoRdSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddPORD(data) {
    const fragmentData = {
      flag: 'addPORD',
      data,
      id: 1,
      state: 'open',
      componentName: AddPoRdComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getPoRdSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
