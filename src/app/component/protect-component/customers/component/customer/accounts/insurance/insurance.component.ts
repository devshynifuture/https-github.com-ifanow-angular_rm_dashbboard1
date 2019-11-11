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
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(':leave', [
          stagger(0.1, [
            animate('0.1s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.1s', style({ opacity: 0 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})

export class InsuranceComponent implements OnInit {
  displayedColumns = ['no', 'life', 'name', 'number', 'sum', 'cvalue', 'premium', 'term', 'pterm', 'desc', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['no', 'owner', 'cvalue', 'amt', 'mvalue', 'rate', 'mdate', 'type', 'ppf', 'desc', 'status', 'icons'];
  dataSource1 = ELEMENT_DATA1;
  advisorId: any;
  constructor(private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  viewMode;
  lifeInsuranceList = ["Term", "Traditional", "ULIP"]
  generalLifeInsuranceList = [/*"Health", "Car/2 Wheeler", "Travel", "Personal accident", "Critical illness", "Cancer", "Home", "Others"*/]
  insuranceTypeId;
  ngOnInit() {
    this.viewMode = "tab1"
    this.advisorId = AuthService.getAdvisorId();
    this.getInsuranceData(this.advisorId,2978,1);
    this.getGlobalDataInsurance();
    this.insuranceTypeId=1
  }
  getInsuranceData(advisorId, clientId, insuranceId) {
    let obj = {
      'advisorId': advisorId,
      'clientId': clientId,
      'insuranceTypeId': insuranceId
    }
    this.cusService.getLifeInsuranceData(obj).subscribe(
      data => this.getInsuranceDataResponse(data)
    )
  }
  getInsuranceDataResponse(data) {
    this.dataSource=data.insuranceList
    console.log("Insurance Data",data)
  }
  
  getGlobalDataInsurance()
  {
    let obj={

    }
    this.cusService.getInsuranceGlobalData(obj).subscribe(
      data=>console.log(data)
    )
  }
  getInsuranceTypeData(typeId)
  {
    this.insuranceTypeId=typeId
    this.getInsuranceData(this.advisorId,2978,typeId)
  }
  toggle(value) {
    if (value === "lifeInsurance") {
     this.generalLifeInsuranceList=[];
     this.lifeInsuranceList=[];
     ["Term", "Traditional", "ULIP"].map((i)=>
      {
        this.lifeInsuranceList.push(i)
      })
   }
    else {
      this.lifeInsuranceList=[];
      this.generalLifeInsuranceList=[];
      ["Health", "Car/2 Wheeler", "Travel", "Personal accident", "Critical illness", "Cancer", "Home" ,"Others"].map((i)=>{
        this.generalLifeInsuranceList.push(i)
      })
    }
  }
  logAnimation(event)
  {
    console.log(event)
  }
  open(flagValue, data) {
    const fragmentData = {
      Flag: flagValue,
      data,
      id: 1,
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