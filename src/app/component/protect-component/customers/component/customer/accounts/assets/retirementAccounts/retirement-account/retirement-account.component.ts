import { AddEPSComponent } from './../add-eps/add-eps.component';
import { AddSuperannuationComponent } from './../add-superannuation/add-superannuation.component';
import { AddGratuityComponent } from './../add-gratuity/add-gratuity.component';
import { NpsSummaryPortfolioComponent } from './../add-nps/nps-summary-portfolio/nps-summary-portfolio.component';
import { AddEPFComponent } from './../add-epf/add-epf.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatSort } from '@angular/material';
import { NpsSchemeHoldingComponent } from "../add-nps/nps-scheme-holding/nps-scheme-holding.component";
import { DetailedViewEPFComponent } from '../add-epf/detailed-view-epf/detailed-view-epf.component';
import { DetailedViewEPSComponent } from '../add-eps/detailed-view-eps/detailed-view-eps.component';
import { DetailedViewGratuityComponent } from '../add-gratuity/detailed-view-gratuity/detailed-view-gratuity.component';

@Component({
  selector: 'app-retirement-account',
  templateUrl: './retirement-account.component.html',
  styleUrls: ['./retirement-account.component.scss']
})
export class RetirementAccountComponent implements OnInit {
  showRequring = '1';
  getObject: {};
  advisorId: any;
  dataGratuityList: any;
  dataSuperannuationList: any;
  EPSList: any;
  dataNPSList: any;
  clientId: any;
  sumOfcurrentEpfBalance: any;
  sumOfcurrentValue: any;
  sumOfemployeesMonthlyContribution: any;
  sumOfemployersMonthlyContribution: any;
  sumOfAmountReceived: any;
  sumOfAnnualEmployeeContribution: any;
  sumOfAnnualEmployerContribution: any;
  totalNotionalValue: any;
  totalPensionAmount: any;
  totalContribution: any;
  totalCurrentValue: any;
  dataEPFList: any;

  @ViewChild('epfListTable', { static: false }) epfListTableSort: MatSort;
  @ViewChild('npsListTable', { static: false }) npsListTableSort: MatSort;
  @ViewChild('gratuityListTable', { static: false }) gratuityListTableSort: MatSort;
  @ViewChild('superAnnuationListTable', { static: false }) superAnnuationListTableSort: MatSort;
  @ViewChild('epsListTable', { static: false }) epsListTableSort: MatSort;


  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService, public utils: UtilService, public dialog: MatDialog) {
  }

  displayedColumns11 = ['no', 'owner', 'cvalue', 'emp', 'empc', 'rate', 'bal', 'bacla', 'year', 'desc', 'status', 'icons'];
  datasource11;

  displayedColumns12 = ['no', 'owner', 'cvalue', 'total', 'scheme', 'pran', 'desc', 'status', 'icons'];
  datasource12;

  displayedColumns13 = ['no', 'owner', 'name', 'number', 'year', 'amt', 'reason', 'desc', 'status', 'icons'];
  datasource13;

  displayedColumns14 = ['no', 'owner', 'aemp', 'aempe', 'rate', 'grate', 'grateemp', 'date', 'desc', 'status', 'icons'];
  datasource14;

  displayedColumns15 = ['no', 'owner', 'nvalue', 'date', 'amt', 'pay', 'desc', 'status', 'icons'];
  datasource15;

  displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];
  datasource16;
  isLoading: boolean = true;

  dataEPSList = new MatTableDataSource(this.datasource11);

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.showRequring = '1'
    this.getObject = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.getListEPF()
    this.dataEPSList.sort = this.epsListTableSort;
  }

  getfixedIncomeData(value) {
    this.showRequring = value;
    (value == '2') ? this.getListNPS() : (value == '3') ? this.getListGratuity() : (value == '4') ? this.getListSuperannuation() : (value == '5') ? this.getListEPS() : this.getListEPF()
  }

  openRetirement(value, state, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state: state
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (value == 'added') {
          this.getListEPF()
        } else if (value == 'addedGratuity') {
          this.getListGratuity()
        } else if (value == 'addedEps') {
          this.getListEPS()
        } else if (value == 'addedSuperannuation') {
          this.getListSuperannuation()
        } else {
          this.getListNPS()
        }
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddEPS(data) {
    const fragmentData = {
      flag: 'addEPS',
      data: data,
      id: 1,
      state: 'open',
      componentName: AddEPSComponent
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

  openAddSuperannuation(data) {
    const fragmentData = {
      flag: 'addSuperannuation',
      data: data,
      id: 1,
      state: 'open',
      componentName: AddSuperannuationComponent
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

  openAddGratuity(data) {
    const fragmentData = {
      flag: 'addGratuity',
      data: data,
      id: 1,
      state: 'open',
      componentName: AddGratuityComponent
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

  openAddSummaryPort(data) {
    const fragmentData = {
      flag: 'addSummaryPort',
      data: data,
      id: 1,
      state: 'open',
      componentName: NpsSummaryPortfolioComponent
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

  openAddEPF(data) {
    const fragmentData = {
      flag: 'addEPF',
      data: data,
      id: 1,
      state: 'open',
      componentName: AddEPFComponent
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
  openDetailedViewEPF(data) {
    const fragmentData = {
      flag: 'addEPF',
      data: data,
      id: 1,
      state: 'open',
      componentName: DetailedViewEPFComponent
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
  detailedViewEPS(data) {
    const fragmentData = {
      flag: 'addEPF',
      data: data,
      id: 1,
      state: 'open',
      componentName: DetailedViewEPSComponent
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
  detailedViewGratuity(data) {
    const fragmentData = {
      flag: 'addEPF',
      data: data,
      id: 1,
      state: 'open',
      componentName: DetailedViewGratuityComponent
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
  openAddSchemeHolding(data) {
    const fragmentData = {
      flag: 'addSchemeHolding',
      data,
      id: 1,
      state: 'open',
      componentName: NpsSchemeHoldingComponent
    };

    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          this.getListNPS();
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();
        }
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
        if (value == 'EPF') {
          this.custumService.deleteEPF(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("EPF is deleted", "dismiss")
              dialogRef.close();
              this.getListEPF()
            },
            err => this.eventService.openSnackBar(err)
          )
        } else if (value == 'NPS') {
          this.custumService.deleteNPS(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("NPS is deleted", "dismiss")
              dialogRef.close();
              this.getListNPS()
            },
            err => this.eventService.openSnackBar(err)
          )
        } else if (value == 'GRATUITY') {
          this.custumService.deleteGratuity(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("Grautity is deleted", "dismiss")
              dialogRef.close();
              this.getListGratuity()
            },
            err => this.eventService.openSnackBar(err)
          )
        } else if (value == 'SUPERANNUATION') {
          this.custumService.deleteSuperAnnuation(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("SuperAnnuation is deleted", "dismiss")
              dialogRef.close();
              this.getListSuperannuation()
            },
            err => this.eventService.openSnackBar(err)
          )
        } else {
          this.custumService.deleteEPS(data.id).subscribe(
            data => {
              this.eventService.openSnackBar("EPS is deleted", "dismiss")
              dialogRef.close();
              this.getListEPS()
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

  getListEPF() {
    let obj = this.getObject
    this.custumService.getEPF(obj).subscribe(
      data => this.getEPFRes(data)
    );
  }

  getEPFRes(data) {
    console.log('getEPFRes =', data);
    this.isLoading = false;
    this.dataEPFList = new MatTableDataSource(data.listOfEpf);
    this.dataEPFList.sort = this.epfListTableSort;
    this.sumOfcurrentEpfBalance = data.sumOfcurrentEpfBalance
    this.sumOfcurrentValue = data.sumOfcurrentValue;
    this.sumOfemployeesMonthlyContribution = data.sumOfemployeesMonthlyContribution;
    this.sumOfemployersMonthlyContribution = data.sumOfemployersMonthlyContribution
  }

  getListGratuity() {
    this.isLoading = true;
    let obj = this.getObject
    this.custumService.getGrauity(obj).subscribe(
      data => this.getGrauityRes(data)
    );
  }

  getGrauityRes(data) {
    console.log('getGrauityRes =', data);
    this.isLoading = false;
    this.dataGratuityList = new MatTableDataSource(data.gratuityList);
    this.dataGratuityList.sort = this.gratuityListTableSort;
    this.sumOfAmountReceived = data.sumOfAmountReceived
  }

  getListNPS() {
    this.isLoading = true;
    let obj = this.getObject
    this.custumService.getNPS(obj).subscribe(
      data => this.getNPSRes(data)
    );
  }

  getNPSRes(data) {
    console.log('getNPSRes =', data);
    this.isLoading = false;
    this.dataNPSList = new MatTableDataSource(data.npsList);
    this.dataNPSList.sort = this.npsListTableSort;
    this.totalContribution = data.totalContribution
    this.totalCurrentValue = data.totalCurrentValue
  }

  getListSuperannuation() {
    this.isLoading = true;
    let obj = this.getObject
    this.custumService.getSuperannuation(obj).subscribe(
      data => this.getSuperannuationRes(data)
    );
  }

  getSuperannuationRes(data) {
    console.log('getSuperannuationRes =', data);
    this.isLoading = false;
    this.dataSuperannuationList = new MatTableDataSource(data.superannuationList);
    this.dataSuperannuationList.sort = this.superAnnuationListTableSort;
    this.sumOfAnnualEmployeeContribution = data.sumOfAnnualEmployeeContribution
    this.sumOfAnnualEmployerContribution = data.sumOfAnnualEmployerContribution
  }

  getListEPS() {
    this.isLoading = true;
    let obj = this.getObject
    this.custumService.getEPS(obj).subscribe(
      data => this.getEPSRes(data)
    );
  }

  getEPSRes(data) {
    console.log('getEPSRes =', data);
    this.isLoading = false;
    this.EPSList = new MatTableDataSource(data.epsList);
    this.EPSList.sort = this.epsListTableSort;
    this.totalNotionalValue = data.totalNotionalValue
    this.totalPensionAmount = data.totalPensionAmount
  }
}

export interface PeriodicElement11 {
  no: string;
  owner: string;
  cvalue: string;
  emp: string;
  empc: string;
  rate: string;
  bal: string;
  bacla: string;
  year: string;
  desc: string;
  status: string;
}


export interface PeriodicElement12 {
  no: string;
  owner: string;
  cvalue: string;
  total: string;
  pran: string;
  scheme: string;
  desc: string;
  status: string;
}

export interface PeriodicElement13 {
  no: string;
  owner: string;
  name: string;
  number: string;
  year: string;
  amt: string;
  reason: string;
  desc: string;
  status: string;
}

export interface PeriodicElement15 {
  no: string;
  owner: string;
  nvalue: string;
  date: string;
  amt: string;
  pay: string;
  desc: string;
  status: string;
}

export interface PeriodicElement16 {
  no: string;
  owner: string;
  cvalue: string;
  rate: string;
  amt: string;
  number: string;
  mdate: string;
  desc: string;
  status: string;
}

export interface PeriodicElement14 {
  no: string;
  owner: string;
  aemp: string;
  aempe: string;
  rate: string;
  grate: string;
  grateemp: string;
  date: string;
  desc: string;
  status: string;
}

