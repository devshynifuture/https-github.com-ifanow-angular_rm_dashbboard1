import { Component, OnInit, ViewChild } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog, MatSidenav } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpperCustomerComponent } from '../../../common-component/upper-customer/upper-customer.component';
import { EnumDataService } from 'src/app/services/enum-data.service';
import { AssetValidationService } from './asset-validation.service';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  dialogState = false;
  sidenavState: boolean = false;
  matSideNavOpen: boolean = true;
  advisorId: any;
  clientId: any;
  unSudcripCounts;
  // sidenavState: boolean = false;
  @ViewChild('sidenav', { static: true }) stateOfPanel: MatSidenav;
  assetSideBarData = [
    { name: 'Mutual funds', viewmode: 'tab1', count: '0', link: './mutual' },
    { name: 'Stocks', viewmode: 'tab2', count: '0', link: './stock' },
    { name: 'Fixed income', viewmode: 'tab3', count: '0', link: './fix' },
    { name: 'Real estate', viewmode: 'tab4', count: '0', link: './real' },
    { name: 'Retirement accounts', viewmode: 'tab5', count: '0', link: './retire' },
    { name: 'Small saving scheme', viewmode: 'tab6', count: '0', link: './small' },
    { name: 'Cash & Bank', viewmode: 'tab7', count: '0', link: './cash_bank' },
    { name: 'Commodities', viewmode: 'tab8', count: '0', link: './commodities' }
  ];
  tab: any;
  Settab: any;
  viewMode = 'tab1';
  isOverlayVisible = false;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    public dialog: MatDialog,
    private cusService: CustomerService,
    private route: ActivatedRoute,
    private assetValidation: AssetValidationService,
    private router: Router, private enumDataService: EnumDataService) {
  }

  close() {
  }

  private loadComponent = false;
  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  dataSource = ELEMENT_DATA;

  displayedColumns1 = ['data', 'amts'];
  datasource1 = ELEMENT_DATA1;

  displayedColumns2 = ['sname', 'amts', 'cvalue', 'profit', 'abs', 'xirr', 'pay', 'outs', 'unit', 'date', 'sip', 'icons'];
  datasource2 = ELEMENT_DATA2;
  displayedColumns3 = ['no', 'owner', 'type', 'value', 'pvalue', 'desc', 'status', 'icons'];
  datasource3 = ELEMENT_DATA3;

  displayedColumns4 = ['no', 'owner', 'type', 'cvalue', 'rate', 'amt', 'mdate', 'mvalue', 'number', 'desc', 'status', 'icons'];
  datasource4 = ELEMENT_DATA4;

  displayedColumns5 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mdate', 'number', 'desc', 'status', 'icons'];
  datasource5 = ELEMENT_DATA5;
  displayedColumns6 = ['no', 'owner', 'cvalue', 'camt', 'amt', 'cdate', 'rate', 'mvalue', 'tenure', 'type', 'desc', 'status', 'icons'];
  datasource6 = ELEMENT_DATA6;
  displayedColumns7 = ['no', 'owner', 'type', 'amt', 'rate', 'bal', 'account', 'bank', 'desc', 'status', 'icons'];
  datasource7 = ELEMENT_DATA7;
  displayedColumns8 = ['no', 'owner', 'cash', 'bal', 'desc', 'status', 'icons'];
  datasource8 = ELEMENT_DATA8;
  displayedColumns9 = ['no', 'owner', 'grams', 'car', 'price', 'mvalue', 'pvalue', 'desc', 'status', 'icons'];
  datasource9 = ELEMENT_DATA9;

  // displayedColumns10 = ['no', 'owner', 'cvalue', 'emp', 'empc', 'rate', 'bal', 'bacla', 'year', 'desc', 'status', 'icons'];
  // datasource10 = ELEMENT_DATA10;


  // displayedColumns11 = ['no', 'owner', 'cvalue', 'emp', 'empc', 'rate', 'bal', 'bacla', 'year', 'desc', 'status', 'icons'];
  // datasource11 = ELEMENT_DATA11;

  // displayedColumns12 = ['no', 'owner', 'cvalue', 'total', 'account', 'rate', 'mdate', 'scheme', 'ppf', 'desc', 'status', 'icons'];
  // datasource12 = ELEMENT_DATA12;

  // displayedColumns13 = ['no', 'owner', 'name', 'number', 'year', 'amt', 'reason', 'desc', 'status', 'icons'];
  // datasource13 = ELEMENT_DATA13;

  // displayedColumns14 = ['no', 'owner', 'aemp', 'rate', 'grate', 'grateemp', 'date', 'desc', 'status', 'icons'];
  // datasource14 = ELEMENT_DATA14;

  // displayedColumns15 = ['no', 'owner', 'nvalue', 'date', 'amt', 'pay', 'desc', 'status', 'icons'];
  // datasource15 = ELEMENT_DATA15;

  // displayedColumns16 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'number', 'mdate', 'desc', 'status', 'icons'];
  // datasource16 = ELEMENT_DATA16;

  // displayedColumns17 = ['no', 'owner', 'cvalue', 'rate', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  // datasource17 = ELEMENT_DATA17;
  // displayedColumns18 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'mvalue', 'mdate', 'desc', 'status', 'icons'];
  // datasource18 = ELEMENT_DATA18;

  // displayedColumns19 = ['no', 'owner', 'payout', 'rate', 'tamt', 'amt', 'mdate', 'desc', 'status', 'icons'];
  // datasource19 = ELEMENT_DATA19;

  // displayedColumns20 = ['no', 'owner', 'cvalue', 'rate', 'balance', 'bdate', 'desc', 'status', 'icons'];
  // datasource20 = ELEMENT_DATA20;


  // displayedColumns22 = ['no', 'owner', 'cvalue', 'rate', 'amt', 'tenure', 'mvalue', 'mdate', 'number', 'desc', 'status', 'icons'];
  // datasource22 = ELEMENT_DATA22;


  // displayedColumns24 = ['name', 'amt', 'cvalue', 'profile', 'abt', 'xirr', 'pay', 'withdraw', 'bal', 'date', 'sip'];
  // dataSource24 = ELEMENT_DATA24;
  // displayedColumns25 = ['scrip', 'owner', 'bal', 'price', 'mprice', 'amt', 'cvalue', 'gain', 'ret', 'xirr', 'dividend', 'icons'];
  // dataSource25 = ELEMENT_DATA25;


  ngOnInit() {
    // this.viewMode = 'tab2';
    this.enumDataService.setBankAccountTypes();
    this.enumDataService.getclientFamilybankList();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    // this.getAssetCountGLobalData();
    // this.stateOfPanel.mode = 'over';
    // this.stateOfPanel.mode = 'side';
    this.stateOfPanel.open();
    // this.route.queryParams.subscribe((params) => {
    //   if (params.tab) {
    //     this.Settab = params.tab;
    //     this.viewMode = this.Settab;
    //     this.eventService.tabData('2');
    //   }
    // });
    this.assetValidation.getAssetCountGLobalData()
    this.unSudcripCounts = this.assetValidation.passCounts().subscribe((data) => {
      this.getAssetCountGLobalDataRes(data)
    })
  }

  toggleSideNav() {
    this.stateOfPanel.toggle();
  }

  getValue(data) {
    if (data == 'Capital Gains' || data == 'Unrealized Transactions') {
      this.sidenavState = true;
      if (this.stateOfPanel._animationState == 'void') {
        this.stateOfPanel.close();
      } else {
        this.toggleSideNav();
      }
    } else {
      this.sidenavState = false;
      this.stateOfPanel.open();

    }
  }

  getRouterLink(assetType) {
    if (assetType['viewmode'] === 'tab1') {
      return assetType['name'].toLowerCase().split(' ').join('-') + '/overview';
    } else {
      return assetType['name'].toLowerCase().split(' ').join('-');
    }
  }

  getActiveRouteStatus(assetType) {
    return this.router.url.split('/')[5] === assetType['name'].toLowerCase().split(' ').join('-');
  }

  getAssetCountGLobalData() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId
    };
    this.cusService.getAssetCountGlobalData(obj).subscribe(
      data => this.getAssetCountGLobalDataRes(data)
    );
  }

  getAssetCountGLobalDataRes(data) {
    const {
      STOCKS,
      cashAndBank,
      fixedIncome,
      real_estate,
      retirementAccounts,
      smallSavingSchemes,
      commodities,
      mutual_fund
    } = data;
    this.assetSideBarData[0].count = mutual_fund;
    this.assetSideBarData[1].count = STOCKS;
    this.assetSideBarData[2].count = fixedIncome;
    this.assetSideBarData[3].count = real_estate;
    this.assetSideBarData[4].count = retirementAccounts;
    this.assetSideBarData[5].count = smallSavingSchemes;
    this.assetSideBarData[6].count = cashAndBank;
    this.assetSideBarData[7].count = commodities;
  }

  openFragment(value) {
    const fragmentData = {
      flag: value,
      id: 1,
      state: 'openHelp'
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

  openUpperFragment(data) {
    /* const fragmentData = {
       flag: 'emailOnly',
       data: clientData,
       id: 1,
       state: 'open'
     };
     const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
       sideBarData => {
         console.log('this is sidebardata in subs subs : ', sideBarData);
         if (UtilService.isDialogClose(sideBarData)) {
           console.log('this is sidebardata in subs subs 2: ',);
           rightSideDataSub.unsubscribe();
         }
       }
     );*/
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: UpperCustomerComponent,
      state: 'open'
    };

    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
        }
      }
    );
  }

  getPrefixData(type) {

  }

  openPortfolioSummary(value, state) {
    const fragmentData = {
      flag: value,
      // data,
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

  ngOnDestroy() {
    this.unSudcripCounts.unsubscribe();
    console.log("unsubscribe");
    
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
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth ',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  { name: 'ICICI Equity Fund Growth  ', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
  { name: 'HDFC Top 200', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  { name: 'Total', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
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
  { data: 'a. Investment', amts: '15,70,000' },
  { data: 'b. Switch In', amts: '2,28,580' },
  { data: 'c. Switch Out', amts: '2,28,580' },
  { data: 'd. Redemption', amts: '0' },
  { data: 'e. Dividend Payout', amts: '0' },
  { data: 'f. Net Investment (a+b-c-d-e)', amts: '2,28,580' },
  { data: 'g. Market Value', amts: '2,28,580' },
  { data: 'h. Net Gain (g-f)', amts: '2,28,580' },
  { data: 'i. Realized XIRR (All Transactions)', amts: '2.81 %' },

];

export interface PeriodicElement3 {
  no: string;
  owner: string;
  type: string;
  value: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {
    no: '1.',
    owner: 'Rahul Jain',
    type: 'Type',
    value: '60,000',
    pvalue: '60,000',
    desc: 'ICICI FD',
    status: 'ICICI FD'
  },
  {
    no: '1.',
    owner: 'Rahul Jain',
    type: 'Type',
    value: '60,000',
    pvalue: '60,000',
    desc: 'ICICI FD',
    status: 'ICICI FD'
  },
  { no: ' ', owner: 'Total', type: '', value: '1,28,925', pvalue: '1,28,925', desc: '', status: ' ' },


];

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
    cdate: '60,000', rate: '8.40%', amt: '1,00,000', mdate: '18/09/2019', mvalue: '1,00,000',
    number: '980787870909', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '2.', owner: 'Rupa Ronak Hindocha', type: 'Bank FD',
    cdate: '60,000', rate: '8.40%', amt: '1,00,000', mdate: '18/09/2019', mvalue: '1,00,000',
    number: '980787870909', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '3.', owner: 'Ronak Hasmukh Hindocha', type: 'Bank FD',
    cdate: '60,000', rate: '8.40%', amt: '1,00,000', mdate: '18/09/2019', mvalue: '1,00,000',
    number: '980787870909', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '', owner: 'Total', type: '',
    cdate: '1,28,925', rate: '8.40%', amt: '1,50,000', mdate: '', mvalue: '1,50,000',
    number: '', desc: '', status: ''
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
    cvalue: '60,000', rate: '8.40%', amt: '1,00,000', mdate: '18/09/2019',
    number: '980787870909', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '2.', owner: 'Rupa Ronak Hindocha',
    cvalue: '60,000', rate: '8.40%', amt: '1,00,000', mdate: '18/09/2019',
    number: '980787870909', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '3.', owner: 'Ronak Hasmukh Hindocha',
    cvalue: '60,000', rate: '8.40%', amt: '1,00,000', mdate: '18/09/2019',
    number: '980787870909', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '', owner: 'Total',
    cvalue: '1,28,925', rate: '8.40%', amt: '1,50,000', mdate: '',
    number: '', desc: '', status: ''
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
    no: '1.',
    owner: 'Ronak Hasmukh Hindocha',
    cvalue: '60,000',
    camt: '1,00,000',
    amt: '1,00,000',
    cdate: '18/09/2019',
    rate: '8.40%',
    mvalue: '18/09/2019',
    tenure: '12',
    type: 'Tax free',
    desc: 'ICICI FD',
    status: 'LIVE'
  },
  {
    no: '2.',
    owner: 'Rupa Ronak Hindocha',
    cvalue: '60,000',
    camt: '1,00,000',
    amt: '1,00,000',
    cdate: '18/09/2019',
    rate: '8.40%',
    mvalue: '18/09/2019',
    tenure: '12',
    type: 'Tax free',
    desc: 'ICICI FD',
    status: 'LIVE'
  },
  {
    no: '', owner: 'Total',
    cvalue: '1,28,925', camt: '1,50,000', amt: '1,50,000', cdate: '', rate: '', mvalue: '', tenure: '', type: '',
    desc: '', status: ''
  },


];

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
    desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '2.', owner: 'Shilpa Jain',
    type: 'Current', amt: '08/02/2019', rate: '8.60%', bal: '50,000', account: '77676767622', bank: 'Axis',
    desc: 'Axis bank FD', status: 'LIVE'
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
  status: string;
}

const ELEMENT_DATA8: PeriodicElement8[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , cash: '94,925', bal: '09/02/2019',
    desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '2.', owner: 'Shilpa Jain'
    , cash: '94,925', bal: '09/02/2019',
    desc: 'Axis bank FD', status: 'LIVE'
  },
  {
    no: '', owner: 'Total'
    , cash: '1,28,925', bal: '',
    desc: '', status: ''
  },


];

export interface PeriodicElement9 {
  no: string;
  owner: string;
  grams: string;
  car: string;
  price: string;
  mvalue: string;
  pvalue: string;
  desc: string;
  status: string;
}

const ELEMENT_DATA9: PeriodicElement9[] = [
  {
    no: '1.', owner: 'Rahul Jain'
    , grams: '50 tolas', car: '24', price: '32,000(as on 20/08/2019)',
    mvalue: '60,000', pvalue: '60,000', desc: 'ICICI FD', status: 'MATURED'
  },
  {
    no: '2.', owner: 'Rahul Jain'
    , grams: '25 tolas', car: '24', price: '32,000(as on 20/08/2019)',
    mvalue: '60,000', pvalue: '60,000', desc: 'ICICI FD', status: 'LIVE'
  },
  {
    no: '', owner: 'Total'
    , grams: '', car: '', price: '',
    mvalue: '1,28,925', pvalue: '1,20,000', desc: '', status: ''
  },

];