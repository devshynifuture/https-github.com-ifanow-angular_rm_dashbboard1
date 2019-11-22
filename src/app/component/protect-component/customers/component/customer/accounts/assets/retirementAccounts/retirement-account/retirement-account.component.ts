import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatSort } from '@angular/material';

@Component({
  selector: 'app-retirement-account',
  templateUrl: './retirement-account.component.html',
  styleUrls: ['./retirement-account.component.scss']
})
export class RetirementAccountComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  showRequring = '1';
  getObject: {};
  advisorId: any;
  dataGratuityList: any;
  dataSuperannuationList: any;
  dataEPSList: any;
  EPSList: any;
  dataNPSList: any;
  clientId: any;
  constructor(private subInjectService: SubscriptionInject, private custumService: CustomerService, private eventService: EventService, public util: UtilService) { }
  displayedColumns11 = ['no', 'owner', 'cvalue', 'emp', 'empc', 'rate', 'bal', 'bacla', 'year', 'desc', 'status', 'icons'];
  datasource11 = ELEMENT_DATA11;

  displayedColumns12 = ['no', 'owner', 'cvalue', 'total', 'scheme', 'pran', 'desc', 'status', 'icons'];
  datasource12 = ELEMENT_DATA12;

  displayedColumns13 = ['no', 'owner', 'name', 'number', 'year', 'amt', 'reason', 'desc', 'status', 'icons'];
  datasource13 = ELEMENT_DATA13;

  displayedColumns14 = ['no', 'owner', 'aemp', 'aempe', 'rate', 'grate', 'grateemp', 'date', 'desc', 'status', 'icons'];
  datasource14 = ELEMENT_DATA14;

  displayedColumns15 = ['no', 'owner', 'nvalue', 'date', 'amt', 'pay', 'desc', 'status', 'icons'];
  datasource15 = ELEMENT_DATA15;

  displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];
  datasource16 = ELEMENT_DATA16;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.showRequring = '1'
    this.getObject = {
      clientId: this.clientId,
      advisorId: this.advisorId
    }
    this.getListEPF()
    this.dataEPSList.sort = this.sort;
  }
  getfixedIncomeData(value) {
    this.showRequring = value;
    (value == '2')?this.getListNPS():(value == '3')?this.getListGratuity():(value == '4')?this.getListSuperannuation():(value == '5')?this.getListEPS():this.getListEPF()
  }
  openRetirement(value, state, data) {
    const fragmentData = {
      Flag: value,
      data: data,
      id: 1,
      state:state
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if(value == 'added'){
          this.getListEPF()
        }else if(value =='addedGratuity'){
          this.getListGratuity()  
        }else if(value == 'addedEps'){
          this.getListEPS()
        }else if(value == 'addedSuperannuation'){
          this.getListSuperannuation()
        }else{
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
  getListEPF() {
    let obj = this.getObject
    this.custumService.getEPF(obj).subscribe(
      data => this.getEPFRes(data)
    );
  }
  getEPFRes(data) {
    console.log('getEPFRes =', data)
    this.dataEPSList = data.listOfEpf
  }
  getListGratuity() {
    let obj = this.getObject
    this.custumService.getGrauity(obj).subscribe(
      data => this.getGrauityRes(data)
    );
  }
  getGrauityRes(data) {
    console.log('getGrauityRes =', data)
    this.dataGratuityList = data.gratuityList
  }
  getListNPS() {
    let obj = this.getObject
    this.custumService.getNPS(obj).subscribe(
      data => this.getNPSRes(data)
    );
  }
  getNPSRes(data) {
    console.log('getNPSRes =', data)
    this.dataNPSList = data
  }
  getListSuperannuation() {
    let obj = this.getObject
    this.custumService.getSuperannuation(obj).subscribe(
      data => this.getSuperannuationRes(data)
    );
  }
  getSuperannuationRes(data) {
    console.log('getSuperannuationRes =', data)
    this.dataSuperannuationList = data.superannuationList
  }
  getListEPS() {
    let obj = this.getObject
    this.custumService.getEPS(obj).subscribe(
      data => this.getEPSRes(data)
    );
  }
  getEPSRes(data) {
    console.log('getEPSRes =', data)
    this.EPSList = data
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

const ELEMENT_DATA11: PeriodicElement11[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , cvalue: "94,925", emp: "94,925", empc: "94,925", rate: "8.40%", bal: "60,000", bacla: "18/09/2021", year: "2021", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Shilpa Jain'
    , cvalue: "94,925", emp: "94,925", empc: "94,925", rate: "8.40%", bal: "60,000", bacla: "18/09/2021", year: "2021", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total'
    , cvalue: "1,28,925", emp: "1,28,925", empc: "1,28,925", rate: "", bal: "1,20,000", bacla: "", year: "", desc: "", status: ""
  },
];




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

const ELEMENT_DATA12: PeriodicElement12[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , cvalue: "94,925", total: "94,925",  scheme: "Cumulative", pran: "8.40%", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Shilpa Jain'
    , cvalue: "94,925", total: "94,925",  scheme: "Cumulative", pran: "8.40%", desc: "ICICI FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total'
    , cvalue: "94,925", total: "1,28,925",  scheme: "", pran: "", desc: "", status: ""
  },

];


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

const ELEMENT_DATA13: PeriodicElement13[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , name: "Futurewise Technologies", number: "5", year: "5", amt: "1,00,000", reason: "Worked for more than 10 years", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Shilpa Jain'
    , name: "Futurewise Technologies", number: "5", year: "5", amt: "1,00,000", reason: "Worked for more than 10 years", desc: "Axis bank FD", status: "LIVE"
  },
  {
    no: '', owner: 'Total'
    , name: "", number: "", year: "", amt: "1,50,000", reason: "", desc: "", status: ""
  },
];

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

const ELEMENT_DATA15: PeriodicElement15[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , nvalue: "94,925", date: "12/11/2022", amt: "60,000", pay: "Monthly", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , nvalue: "94,925", date: "12/11/2022", amt: "60,000", pay: "Monthly", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '', owner: 'Total'
    , nvalue: "1,50,000", date: "", amt: "1,50,000", pay: "", desc: "", status: ""
  },
];

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

const ELEMENT_DATA16: PeriodicElement16[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , cvalue: "94,925", rate: "8.40%", amt: "60,000", number: "76635874357424", mdate: "18/09/2021", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , cvalue: "94,925", rate: "8.40%", amt: "60,000", number: "76635874357424", mdate: "18/09/2021", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '', owner: 'Total'
    , cvalue: "1,28,925", rate: "", amt: "1,20,000", number: "", mdate: "", desc: "", status: ""
  },
];



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

const ELEMENT_DATA14: PeriodicElement14[] = [

  {
    no: '1.', owner: 'Rahul Jain'
    , aemp: "Futurewise Technologies", aempe: "bdjvjf", rate: "5", grate: "5", grateemp: "1,00,000", date: "Worked for more than 10 years", desc: "ICICI FD", status: "MATURED"
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , aemp: "Futurewise Technologies", aempe: "bdjvjf", rate: "5", grate: "5", grateemp: "1,00,000", date: "Worked for more than 10 years", desc: "ICICI FD", status: "MATURED"
  },


];
