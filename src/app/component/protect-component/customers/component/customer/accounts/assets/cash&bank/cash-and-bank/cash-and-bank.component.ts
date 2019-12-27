import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {CustomerService} from '../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {UtilService} from 'src/app/services/util.service';
import {AuthService} from 'src/app/auth-service/authService';
import {ConfirmDialogComponent} from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {BankAccountsComponent} from '../bank-accounts/bank-accounts.component';
import {CashInHandComponent} from '../cash-in-hand/cash-in-hand.component';
import {DetailedViewCashInHandComponent} from '../cash-in-hand/detailed-view-cash-in-hand/detailed-view-cash-in-hand.component';
import {DetailedViewBankAccountComponent} from '../bank-accounts/detailed-view-bank-account/detailed-view-bank-account.component';
import {FormatNumberDirective} from 'src/app/format-number.directive';
import {ExcelService} from '../../../../excel.service';

@Component({
  selector: 'app-cash-and-bank',
  templateUrl: './cash-and-bank.component.html',
  styleUrls: ['./cash-and-bank.component.scss']
})
export class CashAndBankComponent implements OnInit {
  showRequring: string;
  advisorId: any;
  bankAccountList: any = [{}, {}, {}];
  cashInHandList: any = [{}, {}, {}];
  clientId: any;
  totalAccountBalance: any;
  sumOfCashValue: any;
  isLoading = false;
  noData: string;
  excelData: any[];
  footer = [];

  @ViewChild('bankAccountListTable', {static: false}) bankAccountListTableSort: MatSort;

  displayedColumns7 = ['no', 'owner', 'type', 'amt', 'rate', 'bal', 'account', 'bank', 'desc', 'status', 'icons'];
  datasource7 = ELEMENT_DATA7;
  displayedColumns8 = ['no', 'owner', 'cash', 'bal', 'desc', 'status', 'icons'];
  datasource8 = ELEMENT_DATA8;
  @ViewChild('cashInHandListTable', {static: false}) cashInHandListTableSort: MatSort;

  constructor(private excel: ExcelService, private subInjectService: SubscriptionInject,
              private custumService: CustomerService, private eventService: EventService,
              public utils: UtilService, public dialog: MatDialog) {
  }

  @ViewChildren(FormatNumberDirective) formatNumber;

  ngOnInit() {
    this.showRequring = '1';
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getBankAccountList();
  }

  async ExportTOExcel(value) {
    this.excelData = [];
    let data = [];
    var headerData = [{width: 20, key: 'Owner'},
      {width: 20, key: 'Account type'},
      {width: 25, key: 'Balance as on'},
      {width: 18, key: 'Rate'},
      {width: 18, key: 'Balance mentioned'},
      {width: 18, key: 'Account number'},
      {width: 18, key: 'Bank name'},
      {width: 15, key: 'Description'},
      {width: 10, key: 'Status'}];
    var header = ['Owner', 'Account type', ' Balance as on', 'Description', 'Status'];

    if (value == 'Cash in hand') {
      headerData = [{width: 20, key: 'Owner'},
        {width: 20, key: 'Account type'},
        {width: 25, key: ' Balance as on'},
        {width: 15, key: 'Description'},
        {width: 10, key: 'Status'},];
      this.cashInHandList.filteredData.forEach(element => {
        data = [element.ownerName, (element.accountType), (element.balanceAsOn),
          element.description, element.status];
        this.excelData.push(Object.assign(data));
      });
      const footerData = ['Total',
        this.formatNumber.first.formatAndRoundOffNumber(this.sumOfCashValue), '', '', , ''];
      this.footer.push(Object.assign(footerData));
    } else {

      header = ['Owner', 'Account type', 'Balance as on', 'Rate',
        'Balance mentioned', 'Account number', 'Bank name', 'Description', 'Status'];
      this.bankAccountList.filteredData.forEach(element => {
        data = [element.ownerName, (element.accountType == 1) ? 'Current' : 'Savings', new Date(element.balanceAsOn),
          (element.interestRate), this.formatNumber.first.formatAndRoundOffNumber(element.accountBalance),
          (element.account), element.bankName, element.description, element.status];
        this.excelData.push(Object.assign(data));
      });
      const footerData = ['Total', '', '', '', this.formatNumber.first.formatAndRoundOffNumber(this.totalAccountBalance), '', '', '', ''];
      this.footer.push(Object.assign(footerData));
    }
    ExcelService.exportExcel(headerData, header, this.excelData, this.footer, value);
  }

  getfixedIncomeData(value) {
    console.log('value++++++', value);
    this.isLoading = true;
    this.showRequring = value;
    if (value == '2') {
      this.getCashInHandList();
    } else {
      this.getBankAccountList();
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
        if (value == 'BANK') {
          this.custumService.deleteBankAccount(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Bank account is deleted', 'dismiss');
              dialogRef.close();
              this.getBankAccountList();
            },
            err => this.eventService.openSnackBar(err)
          );
        } else {
          this.custumService.deleteCashInHand(data.id).subscribe(
            data => {
              this.eventService.openSnackBar('Cash In Hand is deleted', 'dismiss');
              dialogRef.close();
              this.getCashInHandList();
            },
            err => this.eventService.openSnackBar(err)
          );
        }


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

  getBankAccountList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getBankAccounts(obj).subscribe(
      data => this.getBankAccountsRes(data)
    );
  }

  getBankAccountsRes(data) {
    this.isLoading = false;
    console.log('getBankAccountsRes ####', data);
    this.isLoading = false;
    if (data.cashInBankAccounts.length != 0) {
      this.bankAccountList = new MatTableDataSource(data.cashInBankAccounts);
      this.bankAccountList.sort = this.bankAccountListTableSort;
      this.totalAccountBalance = data.totalAccountBalance;
    } else {
      this.noData = 'No scheme found';
    }
  }

  getCashInHandList() {
    this.isLoading = true;
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    };
    this.custumService.getCashInHand(obj).subscribe(
      data => this.getCashInHandRes(data)
    );
  }

  getCashInHandRes(data) {
    console.log('getCashInHandRes ###', data);
    this.isLoading = false;
    if (data.cashInHands.length != 0) {
      this.cashInHandList = new MatTableDataSource(data.cashInHands);
      this.cashInHandList.sort = this.cashInHandListTableSort;
      this.sumOfCashValue = data.sumOfCashValue;
    } else {
      this.noData = 'No scheme found';
    }
  }

  openCashAndBank(data) {
    const fragmentData = {
      flag: '',
      data,
      id: 1,
      state: 'open',
      componentName: BankAccountsComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        this.getBankAccountList();
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openCashInHand(data) {
    const fragmentData = {
      flag: 'addCashInHand',
      data,
      id: 1,
      state: 'open',
      componentName: CashInHandComponent

    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        this.getCashInHandList();
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  detailedViewbankAccount(data) {
    const fragmentData = {
      flag: 'detailedViewbankAccount',
      id: 1,
      data,
      state: 'open35',
      componentName: DetailedViewBankAccountComponent,
    };
    this.subInjectService.changeNewRightSliderState(fragmentData);
  }

  detailedViewCashInHand(data) {
    const fragmentData = {
      flag: 'detailedViewCashInHand',
      id: 1,
      data,
      state: 'open35',
      componentName: DetailedViewCashInHandComponent,
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

export interface PeriodicElement7 {
  no: string;
  owner: string;
  type: string;
  amt: string;
  rate: string;
  bal: string;
  account: string;
  bank: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA7: PeriodicElement7[] = [
  {
    no: '1.', owner: 'Rahul Jain',
    type: 'Savings', amt: '08/02/2019', rate: '8.40%', bal: '1,00,000', account: '980787870909', bank: 'ICICI',
    desc: 'ICICI FD', status: ''
  },
  {
    no: '2.', owner: 'Shilpa Jain',
    type: 'Current', amt: '08/02/2019', rate: '8.60%', bal: '50,000', account: '77676767622', bank: 'Axis',
    desc: 'Axis bank FD', status: ''
  },
  {
    no: '', owner: 'Total',
    type: '', amt: '', rate: '', bal: '1,50,000', account: '', bank: '',
    desc: '', status: ''
  },


];

export interface PeriodicElement8 {
  no: string;
  owner: string;
  cash: string;
  bal: string;
  desc: string;
}

const ELEMENT_DATA8: PeriodicElement8[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , cash: '94,925', bal: '09/02/2019',
    desc: 'ICICI FD',
  },
  {
    no: '2.', owner: 'Shilpa Jain'
    , cash: '94,925', bal: '09/02/2019',
    desc: 'Axis bank FD',
  },
  {
    no: '', owner: 'Total'
    , cash: '1,28,925', bal: '',
    desc: '',
  },


];
