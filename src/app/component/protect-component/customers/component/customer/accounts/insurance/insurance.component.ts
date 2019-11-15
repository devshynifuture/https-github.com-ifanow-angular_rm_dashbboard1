import { Component, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
  // animations: [
  //   trigger('listAnimation', [
  //     transition('* => *', [ // each time the binding value changes
  //       query(':leave', [
  //         stagger(0.1, [
  //           animate('0.1s', style({ opacity: 0 }))
  //         ])
  //       ], { optional: true }),
  //       query(':enter', [
  //         style({ opacity: 0 }),
  //         stagger(100, [
  //           animate('0.1s', style({ opacity: 0 }))
  //         ])
  //       ], { optional: true })
  //     ])
  //   ])
  // ]
})

export class InsuranceComponent implements OnInit {
  displayedColumns = ['no', 'life', 'name', 'number', 'sum', 'cvalue', 'premium', 'term', 'pterm', 'desc', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['no', 'owner', 'cvalue', 'amt', 'mvalue', 'rate', 'mdate', 'type', 'ppf', 'desc', 'status', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  advisorId: any;
  insuranceSubTypeId: any;
  constructor(private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  viewMode;
  lifeInsuranceList = [{ name: "Term", id: 1 }, { name: "Traditional", id: 2 }, { name: "ULIP", id: 3 }]
  generalLifeInsuranceList = [/*"Health", "Car/2 Wheeler", "Travel", "Personal accident", "Critical illness", "Cancer", "Home", "Others"*/]
  insuranceTypeId;
  ngOnInit() {
    this.viewMode = "tab1"
    this.advisorId = AuthService.getAdvisorId();
    this.getInsuranceData(this.advisorId, 2978, 1, 1);
    this.getGlobalDataInsurance();
    this.insuranceTypeId = 1
    this.insuranceSubTypeId = 1
  }
  getInsuranceData(advisorId, clientId, insuranceId, insuranceSubTypeId) {
    let obj = {
      'advisorId': advisorId,
      'clientId': clientId,
      'insuranceSubTypeId': insuranceSubTypeId,
      'insuranceTypeId': insuranceId
    }
    this.cusService.getLifeInsuranceData(obj).subscribe(
      data => this.getInsuranceDataResponse(data)
    )
  }
  getInsuranceDataResponse(data) {

    (this.insuranceTypeId == 1) ? this.dataSource = data.insuranceList : console.log("general insurance")
    console.log("Insurance Data", data)
  }

  getGlobalDataInsurance() {
    let obj = {

    }
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data => console.log(data)
    )
  }
  getInsuranceTypeData(typeId, typeSubId) {
    this.insuranceTypeId = typeId
    this.insuranceSubTypeId = typeSubId
    this.getInsuranceData(this.advisorId, 2978, typeId, typeSubId)
  }
  toggle(value) {
    if (value === "lifeInsurance") {
      this.generalLifeInsuranceList = [];
      this.lifeInsuranceList = [];
      [{ name: "Term", id: 1 }, { name: "Traditional", id: 2 }, { name: "ULIP", id: 3 }].map((i) => {
        this.lifeInsuranceList.push(i)
      })
    }
    else {
      this.lifeInsuranceList = [];
      this.generalLifeInsuranceList = [];
      [{ name: "Health", id: 4 }, { name: "Car/2 Wheeler", id: 5 }, { name: "Travel", id: 6 }, { name: "Personal accident", id: 7 }, { name: "Critical illness", id: 8 }, { name: "Cancer", id: 9 }, { name: "Home", id: 10 }, { name: "Others", id: 11 }].map((i) => {
        this.generalLifeInsuranceList.push(i)
      })
    }
  }
  editInsurance(data) {
    console.log(data)
  }

  open(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data,
      insuranceTypeId: this.insuranceTypeId,
      insuranceSubTypeId: this.insuranceSubTypeId,
      state: 'open'
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
    no: "1", life: "Rahul Jain", name: "Cumulative", number: "358656327863", sum: "94,925", cvalue: "60,000",
    premium: "1,00,000", term: "45", pterm: "45", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: "2", life: "Shilpa Jain", name: "Cumulative", number: "358656327863", sum: "94,925", cvalue: "60,000",
    premium: "1,00,000", term: "45", pterm: "45", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: "", life: "", name: "", number: "", sum: "94,925", cvalue: "60,000",
    premium: "1,00,000", term: "", pterm: "", desc: "", status: ""
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

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    no: "1", owner: "Rahul Jain", cvalue: "94,925", amt: "60,000", mvalue: "1,00,000", rate: "8.40%",
    mdate: "18/09/2021", type: "Cumulative", ppf: "980787870909", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: "2", owner: "Shilpa Jain", cvalue: "94,925", amt: "60,000", mvalue: "1,00,000", rate: "8.40%",
    mdate: "18/09/2021", type: "Cumulative", ppf: "980787870909", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: "", owner: "Total", cvalue: "1,28,925", amt: "1,28,925", mvalue: "1,28,925", rate: "",
    mdate: "", type: "", ppf: "", desc: "", status: ""
  },
];