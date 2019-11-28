import { RecuringDepositComponent } from './../recuring-deposit/recuring-deposit.component';
import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../customer.service';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-fixed-income',
  templateUrl: './fixed-income.component.html',
  styleUrls: ['./fixed-income.component.scss']
})
export class FixedIncomeComponent implements OnInit {
  isLoading: boolean = true;

  showRequring: any;
  advisorId: any;
  dataSourceFixed: any = [{}, {}, {}, {}];
  dataSourceRecurring: any;
  dataSourceBond: any;
  clientId: any;
  sumAmountInvested: any;
  sumCurrentValue: any;
  sumMaturityValue: any;
  totalCurrentValue: any;
  totalMarketValue: any;
  sumAmountInvestedB: any;
  sumCouponAmount: any;
  sumCurrentValueB: any;


  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService, public util: UtilService, public dialog: MatDialog) { }
  viewMode
  displayedColumns4 = ['no', 'owner', 'type', 'cvalue', 'rate', 'amt', 'mdate', 'mvalue', 'number', 'desc', 'status', 'icons'];
  datasource4 = ELEMENT_DATA4;
  displayedColumns5 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource5 = ELEMENT_DATA5;
  displayedColumns6 = ['no', 'owner', 'cvalue', 'camt', 'amt', 'cdate', 'rate', 'mvalue', 'tenure', 'type', 'desc', 'status', 'icons'];
  datasource6 = ELEMENT_DATA6;

  ngOnInit() {
    this.showRequring = '1'
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getFixedDepositList()
  }
  Close() {

  }
  getfixedIncomeData(value) {
    console.log('value++++++', value)
    this.showRequring = value
    if (value == '2') {
      this.getRecurringDepositList()
    } else if (value == '3') {
      this.getBondsList()
    } else {
      this.getFixedDepositList()
    }

  }
  getFixedDepositList() {
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getFixedDeposit(obj).subscribe(
      data => this.getFixedDepositRes(data)
    );
  }
  getFixedDepositRes(data) {
    console.log('getFixedDepositRes ********** ', data);
    this.isLoading = false;
    this.dataSourceFixed = data.fixedDepositList
    this.sumAmountInvested = data.sumAmountInvested
    this.sumCurrentValue = data.sumCurrentValue
    this.sumMaturityValue = data.sumMaturityValue

  }
  getRecurringDepositList() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getRecurringDeposit(obj).subscribe(
      data => this.getRecurringDepositRes(data)
    );
  }
  getRecurringDepositRes(data) {
    console.log('getRecuringDepositRes ******** ', data);
    this.isLoading = false;
    this.dataSourceRecurring = data.recurringDeposits
    this.totalCurrentValue = data.totalCurrentValue
    this.totalMarketValue = data.totalMarketValue
  }
  getBondsList() {
    this.isLoading = true;
    let obj = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.custumService.getBonds(obj).subscribe(
      data => this.getBondsRes(data)
    );
  }
  getBondsRes(data) {
    console.log('getBondsRes ******** ', data);
    this.isLoading = false;
    this.dataSourceBond = data.bondList
    this.sumAmountInvestedB = data.sumAmountInvested
    this.sumCouponAmount = data.sumCouponAmount
    this.sumCurrentValueB = data.sumCurrentValue
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
        if (value == 'FIXED DEPOSITE') {
          this.custumService.deleteFixedDeposite(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("Fixed deposite is deleted", "dismiss")
              dialogRef.close();
              this.getFixedDepositList();
            },
            err => this.eventService.openSnackBar(err)
          )
        } else if (value == 'RECURRING DEPOSITE') {
          this.custumService.deleteRecurringDeposite(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("Recurring deposite is deleted", "dismiss")
              dialogRef.close();
              this.getRecurringDepositList();
            },
            err => this.eventService.openSnackBar(err)
          )
        } else {
          this.custumService.deleteBond(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("Bond is deleted", "dismiss")
              dialogRef.close();
              this.getBondsList();
            },
            err => this.eventService.openSnackBar(err)
          )
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
  openPortfolioSummary(value, state, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: 'open',
      componentName: RecuringDepositComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        this.getFixedDepositList();
        this.getRecurringDepositList()
        this.getBondsList()
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddRecurringDeposit(data) {
    const fragmentData = {
      Flag: 'addRecuringDeposit',
      data: data,
      id: 1,
      state: 'open',
      componentName: RecuringDepositComponent
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        this.getFixedDepositList();
        this.getRecurringDepositList()
        this.getBondsList()
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
}

export interface PeriodicElement4 {
  no: string;
  owner: string;
  type: string;
  cdate: string;
  rate: string;
  amt: string;
  mdate: string;
  mvalue: string;
  number: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA4: PeriodicElement4[] = [
  {
    no: '1.', owner: 'Ronak Hasmukh Hindocha', type: 'Bank FD',
    cdate: '60,000', rate: '8.40%', amt: '1,00,000', mdate: "18/09/2019", mvalue: "1,00,000",
    number: "980787870909", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '2.', owner: 'Rupa Ronak Hindocha', type: 'Bank FD',
    cdate: '60,000', rate: '8.40%', amt: '1,00,000', mdate: "18/09/2019", mvalue: "1,00,000",
    number: "980787870909", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '3.', owner: 'Ronak Hasmukh Hindocha', type: 'Bank FD',
    cdate: '60,000', rate: '8.40%', amt: '1,00,000', mdate: "18/09/2019", mvalue: "1,00,000",
    number: "980787870909", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total', type: '',
    cdate: '1,28,925', rate: '8.40%', amt: '1,50,000', mdate: "", mvalue: "1,50,000",
    number: "", desc: "", status: ""
  },


];
export interface PeriodicElement5 {
  no: string;
  owner: string;
  cvalue: string;
  rate: string;
  amt: string;
  mdate: string;
  number: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA5: PeriodicElement5[] = [
  {
    no: '1.', owner: 'Ronak Hasmukh Hindocha',
    cvalue: '60,000', rate: '8.40%', amt: '1,00,000', mdate: "18/09/2019",
    number: "980787870909", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '2.', owner: 'Rupa Ronak Hindocha',
    cvalue: '60,000', rate: '8.40%', amt: '1,00,000', mdate: "18/09/2019",
    number: "980787870909", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '3.', owner: 'Ronak Hasmukh Hindocha',
    cvalue: '60,000', rate: '8.40%', amt: '1,00,000', mdate: "18/09/2019",
    number: "980787870909", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total',
    cvalue: '1,28,925', rate: '8.40%', amt: '1,50,000', mdate: "",
    number: "", desc: "", status: ""
  },


];
export interface PeriodicElement6 {
  no: string;
  owner: string;
  cvalue: string;
  camt: string;
  amt: string;
  cdate: string;
  rate: string;
  mvalue: string;
  tenure: string;
  type: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA6: PeriodicElement6[] = [
  {
    no: '1.', owner: 'Ronak Hasmukh Hindocha',
    cvalue: '60,000', camt: "1,00,000", amt: '1,00,000', cdate: "18/09/2019", rate: '8.40%', mvalue: "18/09/2019", tenure: "12", type: "Tax free",
    desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '2.', owner: 'Rupa Ronak Hindocha',
    cvalue: '60,000', camt: "1,00,000", amt: '1,00,000', cdate: "18/09/2019", rate: '8.40%', mvalue: "18/09/2019", tenure: "12", type: "Tax free",
    desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total',
    cvalue: '1,28,925', camt: "1,50,000", amt: '1,50,000', cdate: "", rate: '', mvalue: "", tenure: "", type: "",
    desc: "", status: ""
  },


];
