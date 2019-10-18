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
  viewMode;
  ngOnInit() {
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
