import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mutual-fund-all-transaction',
  templateUrl: './mutual-fund-all-transaction.component.html',
  styleUrls: ['./mutual-fund-all-transaction.component.scss']
})
export class MutualFundAllTransactionComponent implements OnInit {


  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav', 'units', 'balanceUnits', 'days', 'icons'];
  // displayedColumns: string[] = ['schemeName', 'amountInvested', 'currentValue', 'unrealizedProfit', 'absoluteReturn', 'xirr', 'dividendPayout', 'switchOut', 'balanceUnit', 'navDate', 'sipAmount','icons'];




  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalTransactionAmt: number;
  totalUnit: number;
  totalBalanceUnit: number;
  totalNav: number;
  totalObj: { 'total': string; 'totalTransactionAmt': number; 'totalUnit': number; 'totalNav': number; 'totalBalanceUnit': number; };

  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService) { }
  @Input() mutualFund;

  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund)
      this.getSchemeWise();
      this.mfSchemes();
      this.getTotalValue();
    }
  }
  subCatArray() {
    let catObj = {};
    const categoryArray = [];
    if (this.mutualFundList != undefined) {
      this.mutualFundList.forEach(ele => {
        if (ele.subCategoryName) {
          const categoryArray = catObj[ele.subCategoryName] ? catObj[ele.subCategoryName] : [];
          categoryArray.push(ele);
          catObj[ele.subCategoryName] = categoryArray;
        } else {
          categoryArray.push(ele);
        }
      });
      const customDataSource = new MatTableDataSource(categoryArray);
      Object.keys(catObj).map(key => {
        customDataSource.data.push({ groupName: key });
        catObj[key].forEach((singleData) => {
          const obj = {
            'schemeName': singleData.schemeName,
            'nav': singleData.nav
          }
          customDataSource.data.push(obj);
          const obj2 = {
            'name': singleData.ownerName,
            'pan': singleData.pan,
            'folio': singleData.folioNumber
          }
          customDataSource.data.push(obj2);
          singleData.mutualFundTransactions.forEach((ele) => {
            customDataSource.data.push(ele);
          })
          this.getEachTotalValue(singleData);
          customDataSource.data.push(this.totalObj);
        });
      });
      return customDataSource;
    }
  }
  isGroup(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.groupName;
  }
  isGroup2(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.schemeName;
    return item.nav
  }
  isGroup3(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.name;
    return item.pan;
    return item.folio;
  }
  isGroup4(index, item): boolean {
    // console.log('index : ', index);
    // console.log('item : ', item);
    return item.total;
    return item.totalTransactionAmt;
    return item.totalUnit;
    return item.totalNav;
    return item.totalBalanceUnit;

  }
  getSubCategoryWise(data) {
    this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.subCategoryData = this.filteredArray
  }
  getSchemeWise() {
    this.filter(this.filteredArray, 'mutualFundSchemeMaster');
    this.schemeWise = this.filteredArray
  }
  mfSchemes() {
    this.filter(this.schemeWise, 'mutualFund');
    this.mutualFundList = this.filteredArray;
  }
  getTotalValue() {
    this.totalTransactionAmt = 0;
    this.totalUnit = 0;
    this.totalNav = 0;
    this.totalBalanceUnit = 0;
    this.mutualFundList.forEach(element => {
      element.mutualFundTransactions.forEach(ele => {
        this.totalTransactionAmt += ele.amount;
        this.totalUnit += ele.unit;
        this.totalNav += ele.transactionNav;
        this.totalBalanceUnit += ele.balanceUnits;
      });
    })
  }
  getEachTotalValue(data) {
    this.totalTransactionAmt = 0;
    this.totalUnit = 0;
    this.totalNav = 0;
    this.totalBalanceUnit = 0;
    data.mutualFundTransactions.forEach(ele => {
      this.totalTransactionAmt += ele.amount;
      this.totalUnit += ele.unit;
      this.totalNav += ele.transactionNav;
      this.totalBalanceUnit += ele.balanceUnits;
    });
    const obj = {
      'total': 'Total',
      'totalTransactionAmt': this.totalTransactionAmt,
      'totalUnit': this.totalUnit,
      'totalNav': this.totalNav,
      'totalBalanceUnit': this.totalBalanceUnit,
    }
    this.totalObj = obj
  }
  //Used for filtering the data 
  filter(data, key) {
    const filterData = [];
    const finalDataSource = [];
    data.filter(function (element) {
      filterData.push(element[key])
    })
    if (filterData.length > 0) {
      filterData.forEach(element => {
        element.forEach(data => {
          finalDataSource.push(data)
        });
      });
    }
    this.filteredArray = finalDataSource;//final dataSource Value
    return;
  }
}
export interface PeriodicElement {
  schemeName: string;
  amtInvested: number;
  currentValue: number;
  unrealizedProfit: number;
  absReturn: number;
  xirr: number;
  dividendPayout: number;
  withdrawalsSwitchOut: number;
  balanceUnit: number;
  navDate: string;
  sip: number;
}


const ELEMENT_DATA: PeriodicElement[] = [
  { schemeName: 'Agreements & invoices', amtInvested: 15093075, currentValue: 2563562, unrealizedProfit: 5356121, absReturn: 25.23, xirr: 8.32, dividendPayout: 0, withdrawalsSwitchOut: 23561, balanceUnit: 23.56, navDate: '12/05/2018', sip: 500010 },
  { schemeName: 'Agreements & invoices', amtInvested: 15093075, currentValue: 2563562, unrealizedProfit: 5356121, absReturn: 25.23, xirr: 8.32, dividendPayout: 0, withdrawalsSwitchOut: 23561, balanceUnit: 23.56, navDate: '12/05/2018', sip: 500010 },
  { schemeName: 'Agreements & invoices', amtInvested: 15093075, currentValue: 2563562, unrealizedProfit: 5356121, absReturn: 25.23, xirr: 8.32, dividendPayout: 0, withdrawalsSwitchOut: 23561, balanceUnit: 23.56, navDate: '12/05/2018', sip: 500010 },
  { schemeName: 'Agreements & invoices', amtInvested: 15093075, currentValue: 2563562, unrealizedProfit: 5356121, absReturn: 25.23, xirr: 8.32, dividendPayout: 0, withdrawalsSwitchOut: 23561, balanceUnit: 23.56, navDate: '12/05/2018', sip: 500010 },
  { schemeName: 'Total', amtInvested: 875.32, currentValue: 875.32, unrealizedProfit: 12, absReturn: 0, xirr: 0, dividendPayout: 123.67, withdrawalsSwitchOut: 0, balanceUnit: 123.67, navDate: '', sip: 24.87 },
];


export interface PeriodicElement1 {
  schemeName1: string;
  folioNumber: string;
  investorName: string;
  stGain: number;
  stLoss: number;
  ltGain: number;
  indexedGain: number;
  liloss: number;
  indexedLoss: number;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName1: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName1: 'Total', folioNumber: '', investorName: '', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
];



export interface PeriodicElement2 {
  schemeName2: string;
  folioNumber: string;
  dividendPayoutAmount: string;
  dividendReInvestmentAmount: string;
  totalReinvestmentAmount: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { schemeName2: 'DSP Tax Saver Fund - Regular Plan - Growth', folioNumber: '15093075', dividendPayoutAmount: '111,94,925.22', dividendReInvestmentAmount: '23,550', totalReinvestmentAmount: '23,550', },
  { schemeName2: 'Total', folioNumber: ' ', dividendPayoutAmount: '111,94,925.22', dividendReInvestmentAmount: '23,550', totalReinvestmentAmount: '23,550', },

];
