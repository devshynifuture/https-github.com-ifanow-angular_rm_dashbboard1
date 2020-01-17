import {AddSsyComponent} from './../common-component/add-ssy/add-ssy.component';
import {Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../../../customer.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';
import {EventService} from 'src/app/Data-service/event.service';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {DetailedSsyComponent} from './detailed-ssy/detailed-ssy.component';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {ExcelService} from '../../../../excel.service';

@Component({
  selector: 'app-ssy-scheme',
  templateUrl: './ssy-scheme.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SsySchemeComponent implements OnInit {
  advisorId: any;
  clientId: number;
  noData: string;
  isLoading = false;
  data: Array<any> = [{}, {}, {}];
  datasource = new MatTableDataSource(this.data);
  ssyData: any;
  sumOfCurrentValue: number;
  sumOfAmountInvested: number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  excelData: any[];
  footer = [];

  constructor(public dialog: MatDialog, private cusService: CustomerService, private subInjectService: SubscriptionInject, private eventService: EventService) {
  }

  displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getSsySchemedata();
  }

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    const headerData = [{ width: 20, key: 'Owner' },
    { width: 20, key: 'Current Value' },
    { width: 10, key: 'Rate' },
    { width: 25, key: 'Total Amount Invested' },
    { width: 20, key: 'Account Number' },
    { width: 15, key: 'Maturity Date' },
    { width: 15, key: 'Description' },
    { width: 10, key: 'Status' },];
    const header = ['Owner', 'Current Value', 'Rate', 'Total Amount Invested',
      'Account Number', 'Maturity Date', 'Description', 'Status'];
    this.datasource.filteredData.forEach(element => {
      data = [element.ownerName, this.formatNumber.first.formatAndRoundOffNumber(element.currentValue), (element.rate),
      this.formatNumber.first.formatAndRoundOffNumber(element.amountInvested), (element.number), new Date(element.maturityDate), element.description, element.status];
      this.excelData.push(Object.assign(data));
    });
    const footerData = ['Total',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCurrentValue), '',
      this.formatNumber.first.formatAndRoundOffNumber(this.sumOfAmountInvested), '', '', '', ''];
    this.footer.push(Object.assign(footerData));
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getSsySchemedata() {
    this.isLoading = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.datasource.data = [{}, {}, {}];
    this.cusService.getSmallSavingSchemeSSYData(obj).subscribe(
      data => this.getSsySchemedataResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
        this.datasource.data = [];
        this.isLoading = false;
      }
    );
  }

  getSsySchemedataResponse(data) {
    console.log(data);

    this.isLoading = false;
    if (data.SSYList.length != 0) {
      this.datasource.data = data.SSYList;
      this.datasource.sort = this.sort;
      UtilService.checkStatusId(this.datasource.filteredData);
      this.sumOfCurrentValue = data.SumOfCurrentValue;
      this.sumOfAmountInvested = data.SumOfAmountInvested;
      this.ssyData = data;
    } else {
      this.noData = 'No scheme found';
      this.datasource.data = []
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
            this.eventService.openSnackBar('SSY is deleted', 'dismiss');
            dialogRef.close();
            this.getSsySchemedata();
          },
          error => this.eventService.showErrorMessage(error)
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

  addOpenSSY(data, flag) {
    const fragmentData = {
      flag: 'addSyss',
      data,
      id: 1,
      state: (flag == 'detailedSsy') ? 'open35' : 'open',
      componentName: (flag == 'detailedSsy') ? DetailedSsyComponent : AddSsyComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isRefreshRequired(sideBarData)) {
          this.getSsySchemedata();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}
