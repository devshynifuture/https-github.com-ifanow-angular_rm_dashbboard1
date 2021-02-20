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
import { MfServiceService } from './mutual-fund/mf-service.service';
import { element } from 'protractor';
import { RoleService } from 'src/app/auth-service/role.service';

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
  otherThanMf = false;
  // sidenavState: boolean = false;
  @ViewChild('sidenav', { static: true }) stateOfPanel: MatSidenav;
  assetSideBarData = [
    { name: 'Mutual funds', viewmode: 'tab1', count: 0, link: '/customer/detail/account/assets/mutual', tabName: 'mutual_fund' },
    { name: 'Stocks', viewmode: 'tab2', count: 0, link: '/customer/detail/account/assets/stock', tabName: 'STOCKS' },
    { name: 'Fixed income', viewmode: 'tab3', count: 0, link: '/customer/detail/account/assets/fix', tabName: 'fixedIncome' },
    { name: 'Real estate', viewmode: 'tab4', count: 0, link: '/customer/detail/account/assets/real', tabName: 'real_estate' },
    { name: 'Retirement accounts', viewmode: 'tab5', count: 0, link: '/customer/detail/account/assets/retire', tabName: 'retirementAccounts' },
    { name: 'Small saving scheme', viewmode: 'tab6', count: 0, link: '/customer/detail/account/assets/small', tabName: 'smallSavingSchemes' },
    { name: 'Cash & Bank', viewmode: 'tab7', count: 0, link: '/customer/detail/account/assets/cash_bank', tabName: 'cashAndBank' },
    { name: 'Commodities', viewmode: 'tab8', count: 0, link: '/customer/detail/account/assets/commodities', tabName: 'commodities' },
    { name: 'Other assets', viewmode: 'tab9', count: 0, link: '/customer/detail/account/assets/others', tabName: 'otherAsset' },
    // { name: 'Sovereign gold bonds ', viewmode: 'tab10', count: 0, link: '/customer/detail/account/assets/sgb', tabName: 'sovereignGoldBond' },

    // { name: 'Gold bonds', viewmode: 'tab10', count: 0, link: './sgb', tabName: 'goldBonds' }
  ];
  tab: any;
  Settab: any;
  viewMode = 'tab1';
  isOverlayVisible = false;
  callInit: any;
  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    public dialog: MatDialog,
    private cusService: CustomerService,
    private route: ActivatedRoute,
    private assetValidation: AssetValidationService,
    private router: Router, private enumDataService: EnumDataService,
    private mfService: MfServiceService,
    public roleService: RoleService) {
    this.assetValidation.assetCountObserver.subscribe(
      data => {
        if (data.type) {
          this.updateAssetCount(data);
        }
      }
    )
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

  ngOnInit() {
    // this.viewMode = 'tab2';
    console.log(this.router.url)
    this.stateOfPanel.mode = 'side';
    this.callInit = true;
    this.sidebarListBasedOnRolesSetting();
    this.enumDataService.setBankAccountTypes();
    this.enumDataService.getclientFamilybankList();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    // this.getAssetCountGLobalData();
    // this.stateOfPanel.mode = 'over';
    // this.stateOfPanel.mode = 'side';
    this.mfService.getViewMode()
      .subscribe(data => {
        if (data == 'Capital Gains' || data == 'Unrealized Transactions') {
          this.sidenavState = true;
          if (this.stateOfPanel._animationState == 'void') {
            this.stateOfPanel.close();
          } else {
            this.stateOfPanel.close();

            // this.toggleSideNav();
          }
          if (this.callInit && (data == 'Capital Gains' || data == 'Unrealized Transactions')) {
            this.sidenavState = false;
            this.stateOfPanel.open();
          }
        } else {
          this.sidenavState = false;
          this.stateOfPanel.mode = 'side';
          if (data == 'Summary' || data == 'Overview Report' || data == 'All Transactions') {
            if (this.stateOfPanel.opened == false) {
              this.stateOfPanel.close();
              this.sidenavState = true;
            } else {
              this.stateOfPanel.open();
            }
          }
          if (this.callInit && (data == 'Summary' || data == 'Overview Report' || data == 'All Transactions' || data == 'Capital Gains' || data == 'Unrealized Transactions')) {
            this.sidenavState = false;
            this.stateOfPanel.open();
          }
          if (data == "") {
            this.stateOfPanel.open();
          }
          // if (this.stateOfPanel.opened == false) {
          //   this.stateOfPanel.close();
          // } else {
          //   this.stateOfPanel.open();
          // }
          if (this.router.url != "/customer/detail/account/assets/mutual") {
            this.otherThanMf = true;
            this.sidenavState = true;
            this.stateOfPanel.mode = 'side';
            this.stateOfPanel.open();
          }
        }
      })
    // this.stateOfPanel.open();
    this.route.queryParams.subscribe((params) => {
      if (params.tab) {
        this.Settab = params.tab;
        this.viewMode = this.Settab;
        this.eventService.tabData('2');
      }
    });
    // this.assetValidation.getAssetCountGLobalData()
    // this.unSudcripCounts = this.assetValidation.passCounts().subscribe((data) => {
    //   this.getAssetCountGLobalDataRes(data)
    // })
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      clientId: AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1
    };
    this.cusService.getAssetCountGlobalData(obj).subscribe(
      (data) => {
        if (data) {
          this.getAssetCountGLobalDataRes(data)
        }
      }
    );
    this.callInit = false;
  }

  goToRoute(assetData) {
    this.router.navigate([assetData.link])
  }

  sidebarListBasedOnRolesSetting() {
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.cashAndBanks.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'cashAndBank')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.mutualFunds.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'mutual_fund')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.fixedIncome.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'fixedIncome')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.smallSavingSchemes.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'smallSavingSchemes')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.commodities.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'commodities')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.stocks.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'STOCKS')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.realEstate.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'real_estate')
    }
    if (!this.roleService.portfolioPermission.subModule.assets.subModule.retirementAccounts.enabled) {
      this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'retirementAccounts')
    }
    // if (!this.roleService.portfolioPermission.subModule.assets.subModule.sovereignGoldBond.enabled) {
    //   this.assetSideBarData = this.assetSideBarData.filter(element => element.tabName != 'sovereignGoldBond')
    // }
  }

  updateAssetCount(data) {
    if (data.type == "Add") {
      if (data.value == 'STOCKS') {
        this.assetSideBarData[1].count = this.assetSideBarData[1].count + 1;
      }
      if (data.value == 'fixedIncome') {
        this.assetSideBarData[2].count = this.assetSideBarData[2].count + 1;
      }
      if (data.value == 'mutual_fund') {
        this.assetSideBarData[0].count = this.assetSideBarData[0].count + 1;
      }
      if (data.value == 'real_estate') {
        this.assetSideBarData[3].count = this.assetSideBarData[3].count + 1;
      }
      if (data.value == 'retirementAccounts') {
        this.assetSideBarData[4].count = this.assetSideBarData[4].count + 1;
      }
      if (data.value == 'smallSavingSchemes') {
        this.assetSideBarData[5].count = this.assetSideBarData[5].count + 1;
      }
      if (data.value == 'cashAndBank') {
        this.assetSideBarData[6].count = this.assetSideBarData[6].count + 1;
      }
      if (data.value == 'commodities') {
        this.assetSideBarData[7].count = this.assetSideBarData[7].count + 1;
      }
      if (data.value == 'otherAsset') {
        this.assetSideBarData[8].count = this.assetSideBarData[8].count + 1;
      }
      // if (data.value == 'sovereignGoldBond') {
      //   this.assetSideBarData[9].count = this.assetSideBarData[9].count + 1;
      // }
    } else {
      if (data.value == 'STOCKS') {
        this.assetSideBarData[1].count = this.assetSideBarData[1].count - 1;
      }
      if (data.value == 'fixedIncome') {
        this.assetSideBarData[2].count = this.assetSideBarData[2].count - 1;
      }
      if (data.value == 'mutual_fund') {
        this.assetSideBarData[0].count = this.assetSideBarData[0].count - 1;
      }
      if (data.value == 'real_estate') {
        this.assetSideBarData[3].count = this.assetSideBarData[3].count - 1;
      }
      if (data.value == 'retirementAccounts') {
        this.assetSideBarData[4].count = this.assetSideBarData[4].count - 1;
      }
      if (data.value == 'smallSavingSchemes') {
        this.assetSideBarData[5].count = this.assetSideBarData[5].count - 1;
      }
      if (data.value == 'cashAndBank') {
        this.assetSideBarData[6].count = this.assetSideBarData[6].count - 1;
      }
      if (data.value == 'commodities') {
        this.assetSideBarData[7].count = this.assetSideBarData[7].count - 1;
      }
      if (data.value == 'otherAsset') {
        this.assetSideBarData[8].count = this.assetSideBarData[8].count - 1;
      }
      // if (data.value == 'sovereignGoldBond') {
      //   this.assetSideBarData[9].count = this.assetSideBarData[9].count - 1;
      // }
    }
  }


  toggleSideNav() {
    console.log(this.sidenavState);
    this.stateOfPanel.toggle();
    this.sidenavState = !this.sidenavState;
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
      mutual_fund,
      otherAsset,
      // sovereignGoldBond
    } = data;
    // this.assetSideBarData[0].count = mutual_fund;
    // this.assetSideBarData[1].count = STOCKS;
    // this.assetSideBarData[2].count = fixedIncome;
    // this.assetSideBarData[3].count = real_estate;
    // this.assetSideBarData[4].count = retirementAccounts;
    // this.assetSideBarData[5].count = smallSavingSchemes;
    // this.assetSideBarData[6].count = cashAndBank;
    // this.assetSideBarData[7].count = commodities;
    // this.assetSideBarData[8].count = otherAsset;
    this.assetSideBarData.forEach(element => {
      if (element.tabName == 'mutual_fund') {
        element.count = mutual_fund
      }
      if (element.tabName == 'STOCKS') {
        element.count = STOCKS
      }
      if (element.tabName == 'fixedIncome') {
        element.count = fixedIncome
      }
      if (element.tabName == 'real_estate') {
        element.count = real_estate
      }
      if (element.tabName == 'retirementAccounts') {
        element.count = retirementAccounts
      }
      if (element.tabName == 'smallSavingSchemes') {
        element.count = smallSavingSchemes
      }
      if (element.tabName == 'cashAndBank') {
        element.count = cashAndBank
      }
      if (element.tabName == 'commodities') {
        element.count = commodities
      }
      if (element.tabName == 'otherAsset') {
        element.count = otherAsset
      }
      // if (element.tabName == 'sovereignGoldBond') {
      //   element.count = sovereignGoldBond ? sovereignGoldBond : 0;
      // }
    })
  }
  clickable(value) {
    if (value.name == 'Mutual funds') {
      this.sidenavState = false;
      this.otherThanMf = false;
      this.stateOfPanel.open();
    } else {
      this.otherThanMf = true;
      this.sidenavState = true;
      this.stateOfPanel.open();
    }

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
    this.assetValidation.addAssetCount({});
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