import {AddScssComponent} from './../common-component/add-scss/add-scss.component';
import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {MAT_DATE_FORMATS, MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {EventService} from 'src/app/Data-service/event.service';
import {DetailedScssComponent} from './detailed-scss/detailed-scss.component';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {ExcelService} from '../../../../excel.service';

@Component({
  selector: 'app-scss-scheme',
  templateUrl: './scss-scheme.component.html',
  styleUrls: ['./scss-scheme.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ]
})
export class ScssSchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  scssData: any;
  sumOfQuarterlyPayout: number;
  sumOfTotalAmountReceived: number;
  sumOfAmountInvested: number;
  footer = [];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];

  constructor(public dialog: MatDialog, private eventService: EventService, private cusService: CustomerService, private subInjectService: SubscriptionInject) {
  }

  displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getScssSchemedata();
  }

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{width: 20, key: 'Owner'},
      {width: 20, key: 'Quarterly Payout'},
      {width: 10, key: 'Rate'},
      {width: 20, key: 'Total Amount Recieved'},
      {width: 25, key: 'Amount Invested'},
      {width: 15, key: 'Maturity Date'},
      {width: 15, key: 'Description'},
      {width: 10, key: 'Status'},];
    const header = ['Owner', 'Quarterly Payout', 'Rate', 'Total Amount Recieved', 'Amount Invested',
      'Maturity Date', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, (element.quarterlyPayout), (element.rate),
        this.formatNumber.first.formatAndRoundOffNumber(element.totalAmountReceived),
        this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested),
        (element.maturityValue), new Date(element.maturityDate), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total', '', this.formatNumber.first.formatAndRoundOffNumber(this.sumOfQuarterlyPayout),
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfTotalAmountReceived),
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getScssSchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      requiredDate: ''
    };
    this.cusService.getSmallSavingSchemeSCSSData(obj).subscribe(
      data => this.getKvpSchemedataResponse(data), (error) => {
        this.eventService.openSnackBar('Somthing went worng!', 'dismiss');
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
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
            this.eventService.openSnackBar('SCSS is deleted', 'dismiss');
            dialogRef.close();
            this.getScssSchemedata();
          },
          err => this.eventService.openSnackBar(err)
        );
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
    if (data && data.scssList && data.scssList.length > 0) {
      this.datasource.data = data.scssList;
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData);
      this.sumOfAmountInvested = data.sumOfAmountInvested;
      this.sumOfTotalAmountReceived = data.sumOfTotalAmountReceived;
      this.sumOfQuarterlyPayout = data.sumOfQuarterlyPayout;
      this.scssData = data;
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = []
    }
    console.log('datasource', this.datasource)
  }

  openAddSCSS(data, flag) {
    const fragmentData = {
      flag: 'addSCSS',
      data,
      id: 1,
      state: (flag == 'detailedScss') ? 'open35' : 'open',
      componentName: (flag == 'detailedScss') ? DetailedScssComponent : AddScssComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getScssSchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
