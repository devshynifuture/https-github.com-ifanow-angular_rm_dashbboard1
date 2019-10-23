import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  constructor() {
  }

  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  dataSource = ELEMENT_DATA;
  // displayedColumns1 = ['data', 'amts'];
  datasource1 = ELEMENT_DATA1;
  displayedColumns2 = ['sname', 'amts', 'cvalue', 'profit', 'abs', 'xirr', 'pay', 'outs', 'unit', 'date', 'sip', 'icons'];
  datasource2 = ELEMENT_DATA2;
  displayedColumns3 = ['no', 'owner', 'type', 'value', 'pvalue', 'desc', 'status','icons'];
  datasource3 = ELEMENT_DATA3;
  displayedColumns4 = ['no', 'owner', 'type', 'cvalue', 'rate', 'amt','mdate','mvalue','number','desc','status','icons'];
  datasource4 = ELEMENT_DATA4;
  displayedColumns5 = ['no', 'owner', 'cvalue', 'rate', 'amt','mdate','number','desc','status','icons'];
  datasource5 = ELEMENT_DATA5;
  displayedColumns6 = ['no', 'owner', 'cvalue', 'camt', 'amt','cdate','rate','mvalue','tenure','type','desc','status','icons'];
  datasource6 = ELEMENT_DATA6;
  viewMode;
  ngOnInit() {
    this.viewMode="tab1"
  }

  getPrefixData(type) {

  }
}

export interface PeriodicElement {
  name: string;
  amt: string;
  value: string;
  abs: number;
  xirr: number;
  alloc: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  {name: 'ICICI Equity Fund Growth	', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32},
  {name: 'HDFC Top 200', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32},
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  {name: 'Total', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32},
];

export interface PeriodicElement2 {
  sname: string;
  amts: string;
  cvalue: string;
  profit: string;
  abs: string;
  xirr: string;
  pay: number;
  outs: string;
  unit: string;
  date: string;
  sip: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [

  {
    sname: 'DSP Tax Saver Fund - Regular Plan - Growth| 5287365/24| Forum Mitesh Galani',
    amts: '94,925',
    cvalue: '94,925',
    profit: '4,597',
    abs: '26.99',
    xirr: '8.32',
    pay: 0,
    outs: '23,550',
    unit: '23,550',
    date: '24.87 01/09/2019',
    sip: '12,000'
  },
  {
    sname: 'DSP Tax Saver Fund - Regular Plan - Growth| 5287365/24| Forum Mitesh Galani',
    amts: '94,925',
    cvalue: '94,925',
    profit: '4,597',
    abs: '26.99',
    xirr: '8.32',
    pay: 0,
    outs: '23,550',
    unit: '23,550',
    date: '24.87 01/09/2019',
    sip: '12,000'
  },
  {
    sname: 'DSP Tax Saver Fund - Regular Plan - Growth| 5287365/24| Forum Mitesh Galani',
    amts: '94,925',
    cvalue: '94,925',
    profit: '4,597',
    abs: '26.99',
    xirr: '8.32',
    pay: 0,
    outs: '23,550',
    unit: '23,550',
    date: '24.87 01/09/2019',
    sip: '12,000'
  },
  {
    sname: 'DSP Tax Saver Fund - Regular Plan - Growth| 5287365/24| Forum Mitesh Galani',
    amts: '94,925',
    cvalue: '94,925',
    profit: '4,597',
    abs: '26.99',
    xirr: '8.32',
    pay: 0,
    outs: '23,550',
    unit: '23,550',
    date: '24.87 01/09/2019',
    sip: '12,000'
  },
  {
    sname: 'DSP Tax Saver Fund - Regular Plan - Growth| 5287365/24| Forum Mitesh Galani',
    amts: '94,925',
    cvalue: '94,925',
    profit: '4,597',
    abs: '26.99',
    xirr: '8.32',
    pay: 0,
    outs: '23,550',
    unit: '23,550',
    date: '24.87 01/09/2019',
    sip: '12,000'
  },
  {
    sname: 'Total',
    amts: '111,94,925.22',
    cvalue: '111,94,925.22',
    profit: '111,94,925.22',
    abs: '875.32',
    xirr: '8.32',
    pay: 0,
    outs: '0',
    unit: '111,94,925.22',
    date: '',
    sip: '12,000'
  },


];

export interface PeriodicElement1 {
  data: string;
  amts: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {data: 'a. Investment', amts: '15,70,000'},
  {data: 'b. Switch In', amts: '2,28,580'},
  {data: 'c. Switch Out', amts: '2,28,580'},
  {data: 'd. Redemption', amts: '0'},
  {data: 'e. Dividend Payout', amts: '0'},
  {data: 'f. Net Investment (a+b-c-d-e)', amts: '2,28,580'},
  {data: 'g. Market Value', amts: '2,28,580'},
  {data: 'h. Net Gain (g-f)', amts: '2,28,580'},
  {data: 'i. Realized XIRR (All Transactions)', amts: '2.81 %'},

];
export interface PeriodicElement3 {
  no: string;
  owner: string;
  type:string;
  value:string;
  pvalue:string;
  desc:string;
  status:string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {no: '1.', owner: 'Rahul Jain',type:'Type',value:'60,000',pvalue:'60,000',desc:'ICICI FD',status:'ICICI FD'},
  {no: '1.', owner: 'Rahul Jain',type:'Type',value:'60,000',pvalue:'60,000',desc:'ICICI FD',status:'ICICI FD'},
  {no: ' ', owner: 'Total',type:'',value:'1,28,925',pvalue:'1,28,925',desc:'',status:' '},
 

];
export interface PeriodicElement4 {
  no: string;
  owner: string;
  type:string;
 
  cdate:string;
  rate:string;
  amt:string;
  mdate:string;
  mvalue:string;
  number:string;
  desc:string;
  status:string;
}

const ELEMENT_DATA4: PeriodicElement4[] = [
  {no: '1.', owner: 'Ronak Hasmukh Hindocha',type:'Bank FD',
  cdate:'60,000',rate:'8.40%',amt:'1,00,000',mdate:"18/09/2019",mvalue:"1,00,000",
  number:"980787870909",desc:"ICICI FD",status:"LIVE"},
  {no: '2.', owner: 'Rupa Ronak Hindocha',type:'Bank FD',
  cdate:'60,000',rate:'8.40%',amt:'1,00,000',mdate:"18/09/2019",mvalue:"1,00,000",
  number:"980787870909",desc:"ICICI FD",status:"LIVE"},
  {no: '3.', owner: 'Ronak Hasmukh Hindocha',type:'Bank FD',
  cdate:'60,000',rate:'8.40%',amt:'1,00,000',mdate:"18/09/2019",mvalue:"1,00,000",
  number:"980787870909",desc:"ICICI FD",status:"LIVE"},
  {no: '', owner: 'Total',type:'',
  cdate:'1,28,925',rate:'8.40%',amt:'1,50,000',mdate:"",mvalue:"1,50,000",
  number:"",desc:"",status:""},
 

];
export interface PeriodicElement5 {
  no: string;
  owner: string;
  cvalue:string;
  rate:string;
  amt:string;
  mdate:string;
  number:string;
  desc:string;
  status:string;
}

const ELEMENT_DATA5: PeriodicElement5[] = [
  {no: '1.', owner: 'Ronak Hasmukh Hindocha',
  cvalue:'60,000',rate:'8.40%',amt:'1,00,000',mdate:"18/09/2019",
  number:"980787870909",desc:"ICICI FD",status:"LIVE"},
  {no: '2.', owner: 'Rupa Ronak Hindocha',
  cvalue:'60,000',rate:'8.40%',amt:'1,00,000',mdate:"18/09/2019",
  number:"980787870909",desc:"ICICI FD",status:"LIVE"},
  {no: '3.', owner: 'Ronak Hasmukh Hindocha',
  cvalue:'60,000',rate:'8.40%',amt:'1,00,000',mdate:"18/09/2019",
  number:"980787870909",desc:"ICICI FD",status:"LIVE"},
  {no: '', owner: 'Total',
  cvalue:'1,28,925',rate:'8.40%',amt:'1,50,000',mdate:"",
  number:"",desc:"",status:""},
 

];
export interface PeriodicElement6 {
  no: string;
  owner: string;
  cvalue:string;
  camt:string;
  amt:string;
  cdate:string;
  rate:string;
  mvalue:string;
  tenure:string;
  type:string;
  desc:string;
  status:string;
}

const ELEMENT_DATA6: PeriodicElement6[] = [
  {no: '1.', owner: 'Ronak Hasmukh Hindocha',
  cvalue:'60,000',camt:"1,00,000",amt:'1,00,000',cdate:"18/09/2019",rate:'8.40%',mvalue:"18/09/2019",tenure:"12",type:"Tax free",
 desc:"ICICI FD",status:"LIVE"},
 {no: '2.', owner: 'Rupa Ronak Hindocha',
 cvalue:'60,000',camt:"1,00,000",amt:'1,00,000',cdate:"18/09/2019",rate:'8.40%',mvalue:"18/09/2019",tenure:"12",type:"Tax free",
desc:"ICICI FD",status:"LIVE"},
  {no: '', owner: 'Total',
  cvalue:'1,28,925',camt:"1,50,000",amt:'1,50,000',cdate:"",rate:'',mvalue:"",tenure:"",type:"",
  desc:"",status:""},
 

];
