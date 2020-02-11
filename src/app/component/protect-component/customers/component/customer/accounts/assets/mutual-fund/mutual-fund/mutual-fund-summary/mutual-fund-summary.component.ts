import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mutual-fund-summary',
  templateUrl: './mutual-fund-summary.component.html',
  styleUrls: ['./mutual-fund-summary.component.scss']
})
export class MutualFundSummaryComponent implements OnInit {
  displayedColumns: string[] = ['schemeName', 'amtInvested', 'currentValue', 'unrealizedProfit', 'absReturn', 'xirr', 'dividendPayout', 'withdrawalsSwitchOut', 'balanceUnit', 'navDate', 'sip'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['schemeName1', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  dataSource1 = ELEMENT_DATA1;

  displayedColumns2: string[] = ['schemeName2', 'folioNumber', 'dividendPayoutAmount', 'dividendReInvestmentAmount', 'totalReinvestmentAmount'];
  dataSource2 = ELEMENT_DATA2;
  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];

  constructor() { }
  @Input() mutualFund;

  ngOnInit() {
    this.getSubCategoryWise(this.mutualFund)
    this.getSchemeWise();
    this.mfSchemes();
    this.subCatArray();
  }
  subCatArray() {
    const catObj = {};
    this.mutualFundList.forEach(ele => {
      if (ele.subCategory) {
        const categoryArray = catObj[ele.subCategory] ? catObj[ele.subCategory] : [];
        categoryArray.push(ele);
        catObj[ele.subCategory] = categoryArray;
      }
    });


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
    console.log(finalDataSource)
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