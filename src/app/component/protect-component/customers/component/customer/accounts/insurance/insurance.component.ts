import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';
import { ConfirmDialogComponent } from 'src/app/component/protect-component/common-component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { EventService } from 'src/app/Data-service/event.service';
import { AddInsuranceComponent } from '../../../common-component/add-insurance/add-insurance.component';
import { DetailedViewComponent } from "../../../common-component/detailed-view/detailed-view.component";

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})

export class InsuranceComponent implements OnInit {
  displayedColumns = ['no', 'life', 'name', 'number', 'sum', 'cvalue', 'premium', 'term', 'pterm', 'desc', 'status', 'icons'];
  dataSource;
  displayedColumns1 = ['no', 'owner', 'cvalue', 'amt', 'mvalue', 'rate', 'mdate', 'type', 'ppf', 'desc', 'status', 'icons'];
  dataSource1;
  advisorId: any;
  insuranceSubTypeId: any;
  clientId: any;
  noData: string;
  lifeInsuranceFlag: boolean;
  generalInsuranceFlag: boolean;

  constructor(private eventService: EventService, public dialog: MatDialog, private subInjectService: SubscriptionInject, private cusService: CustomerService) {
  }

  viewMode;
  lifeInsuranceList = [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }];
  generalLifeInsuranceList = [/*"Health", "Car/2 Wheeler", "Travel", "Personal accident", "Critical illness", "Cancer", "Home", "Others"*/];
  insuranceTypeId;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.insuranceTypeId = 1;
    this.insuranceSubTypeId = 0;
    this.getGlobalDataInsurance();
    this.getInsuranceData(1);
    this.lifeInsuranceFlag = true;
    this.generalInsuranceFlag = false;
  }

  getInsuranceSubTypeData(advisorId, clientId, insuranceId, insuranceSubTypeId) {
    const obj = {
      advisorId: advisorId,
      clientId: clientId,
      insuranceSubTypeId: insuranceSubTypeId,
      insuranceTypeId: insuranceId
    };
    this.cusService.getLifeInsuranceData(obj).subscribe(
      data => this.getInsuranceDataResponse(data)
    );
  }

  getInsuranceDataResponse(data) {

    if (data) {
      this.dataSource = data.insuranceList;
    }
    else {
      this.dataSource = data
      this.noData = "No Insurance Data"
    }
  }

  getInsuranceData(typeId) {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      insuranceTypeId: typeId
    };
    this.cusService.getInsuranceData(obj).subscribe(
      data => this.getInsuranceDataRes(data)
    );
  }

  getInsuranceDataRes(data) {
    if (data) {
      this.dataSource = data.insuranceList;
    } else {
      this.dataSource = undefined;
      this.noData = 'No Insurance Data';
    }
  }

  getGlobalDataInsurance() {
    const obj = {};
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data => console.log(data)
    );
  }

  getInsuranceTypeData(typeId, typeSubId) {
    this.lifeInsuranceFlag = false;
    this.insuranceTypeId = typeId;
    this.insuranceSubTypeId = typeSubId;
    this.getInsuranceSubTypeData(this.advisorId, 2978, typeId, typeSubId);
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
        this.cusService.deleteInsurance(data.id).subscribe(
          data => {
            this.eventService.openSnackBar('Insurance is deleted', 'dismiss');
            dialogRef.close();
            this.getInsuranceData(this.insuranceTypeId)
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

  toggle(value) {
    if (value === 'lifeInsurance') {
      this.lifeInsuranceFlag = true;
      this.generalInsuranceFlag = false;
      this.insuranceSubTypeId = 0;
      this.generalLifeInsuranceList = [];
      this.lifeInsuranceList = [];
      [{ name: 'Term', id: 1 }, { name: 'Traditional', id: 2 }, { name: 'ULIP', id: 3 }].map((i) => {
        this.lifeInsuranceList.push(i);
      });
    } else {
      this.lifeInsuranceList = [];
      this.lifeInsuranceFlag = false;
      this.generalInsuranceFlag = true;
      this.generalLifeInsuranceList = [];
      [{ name: 'Health', id: 4 }, { name: 'Car/2 Wheeler', id: 5 }, { name: 'Travel', id: 6 }, {
        name: 'Personal accident',
        id: 7
      }, { name: 'Critical illness', id: 8 }, { name: 'Cancer', id: 9 }, { name: 'Home', id: 10 }, {
        name: 'Others',
        id: 11
      }].map((i) => {
        this.generalLifeInsuranceList.push(i);
      });
    }
  }

  editInsurance(data) {
    console.log(data);
  }

  open(data) {
    const fragmentData = {
      flag: 'detailedView',
      data,
      componentName: DetailedViewComponent,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.getInsuranceSubTypeData(this.advisorId, this.clientId, this.insuranceTypeId, this.insuranceSubTypeId);
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

  openAddInsurance(data) {
    const inputData = {
      data,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
    };
    const fragmentData = {
      flag: 'addInsurance',
      data: inputData,
      componentName: AddInsuranceComponent,
      state: 'open'
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          this.lifeInsuranceFlag = true
          this.insuranceSubTypeId = 0;
          this.getInsuranceData(this.insuranceTypeId)
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }

}


export interface PeriodicElement {
  no: string;
  life: string;
  name: string;
  number: string;
  sum: string;
  cvalue: string;
  premium: string;
  term: string;
  pterm: string;
  desc: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    no: '1', life: 'Rahul Jain', name: 'Cumulative', number: '358656327863', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '45', pterm: '45', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '2', life: 'Shilpa Jain', name: 'Cumulative', number: '358656327863', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '45', pterm: '45', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '', life: '', name: '', number: '', sum: '94,925', cvalue: '60,000',
    premium: '1,00,000', term: '', pterm: '', desc: '', status: ''
  },
];

export interface PeriodicElement1 {
  no: string;
  owner: string;
  cvalue: string;
  amt: string;
  mvalue: string;
  rate: string;
  mdate: string;
  type: string;
  ppf: string;
  desc: string;
  status: string;

}
