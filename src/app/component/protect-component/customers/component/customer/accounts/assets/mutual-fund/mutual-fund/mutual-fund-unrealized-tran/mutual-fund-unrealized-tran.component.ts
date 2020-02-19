import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mutual-fund-unrealized-tran',
  templateUrl: './mutual-fund-unrealized-tran.component.html',
  styleUrls: ['./mutual-fund-unrealized-tran.component.scss']
})
export class MutualFundUnrealizedTranComponent implements OnInit {
  displayedColumns: string[] = ['no', 'transactionType', 'transactionDate', 'transactionAmount', 'transactionNav', 'units', 'currentValue', 'dividendPayout', 'dividendReinvest', 'totalAmount', 'gain', 'absReturn', 'xirr'];
  displayedColumns2: string[] = ['categoryName', 'amtInvested', 'currentValue', 'dividendPayout', 'dividendReinvest', 'gain', 'absReturn', 'xirr', 'allocation'];
  mfData: any;
  filteredArray: any[];
  subCategoryData: any[];
  schemeWise: any[];
  mutualFundList: any[];
  totalTransactionAmt: number;
  totalUnit: number;
  totalNav: number;
  totalObj: {};
  categoryMF: any[];
  currentValue: any;
  dividendPayout: any;
  divReinvestment: any;
  totalAmount: any;
  absReturn: any;
  gain: any;
  xirr: any;
  amountInvested: number;
  dividendReinvest: any;
  dataSource: any[];
  finalTotalTransactionAmt: any;
  finalTotalUnit: any;
  finalTotalNav: any;
  finalCurrentValue: any;
  finalDividendPayout: any;
  finalDivReinvestment: any;
  finalTotalAmount: any;
  finalGain: any;
  finalAbsReturn: any;
  finalXirr: any;
  finalAllocationPer: number;
  constructor(private subInjectService: SubscriptionInject, private UtilService: UtilService) { }
  @Input() mutualFund;
  ngOnInit() {
    if (this.mutualFund != undefined) {
      this.getSubCategoryWise(this.mutualFund)
      this.getSchemeWise();
      this.mfSchemes();
      this.getfinalTotalValue();
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
  getCategory() { // first table category wise
    let catObj = {};
    const categoryArray = [];
    let newArray = [];
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
      Object.keys(catObj).map(key => {
        this.totalTransactionAmt = 0;
        this.totalUnit = 0;
        this.totalNav = 0;
        this.currentValue = 0;
        this.dividendPayout = 0;
        this.divReinvestment = 0;
        this.totalAmount = 0;
        this.gain = 0;
        this.absReturn = 0;
        this.xirr = 0;
        catObj[key].forEach((singleData) => {
          singleData.mutualFundTransactions.forEach(ele => {
            this.getCategoryWiseTotal(ele);
          })
        });
        const obj = {
          'total': 'Total',
          'totalTransactionAmt': this.totalTransactionAmt,
          'totalUnit': this.totalUnit,
          'totalNav': this.totalNav,
          'totalCurrentValue': this.currentValue,
          'dividendPayout': this.dividendPayout,
          'divReinvestment': this.divReinvestment,
          'totalAmount': this.totalAmount,
          'gain': this.gain,
          'absReturn': this.absReturn,
          'xirr': this.xirr,
          'amountInvested': this.amountInvested,
          'categoryName': key
        }
        newArray.push(obj)
      });
      this.dataSource = newArray
    }
  }
  isGroup(index, item): boolean {//group category wise
    return item.groupName;
  }
  isGroup2(index, item): boolean {//for grouping schme name
    return item.schemeName;
    return item.nav
  }
  isGroup3(index, item): boolean {//for grouping family member name
    return item.name;
    return item.pan;
    return item.folio;
  }
  isGroup4(index, item) {//for getting total of each scheme
    return item.total;
    return item.totalTransactionAmt;
    return item.totalUnit;
    return item.totalNav;
    return item.totalCurrentValue;
    return item.dividendPayout;
    return item.divReinvestment;
    return item.totalAmount;
    return item.gain;
    return item.absReturn;
    return item.xirr;
  }
  getSubCategoryWise(data) {//return sub category list
    this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.subCategoryData = this.filteredArray
  }
  getSchemeWise() {//return scheme wise list
    this.filter(this.filteredArray, 'mutualFundSchemeMaster');
    this.schemeWise = this.filteredArray
  }
  mfSchemes() {//get last mf list
    this.filter(this.schemeWise, 'mutualFund');
    this.mutualFundList = this.filteredArray;
    this.getCategory();
  }
  getfinalTotalValue() { //grand total values
    this.finalTotalTransactionAmt = 0;
    this.finalTotalUnit = 0;
    this.finalTotalNav = 0;
    this.finalCurrentValue = 0;
    this.finalDividendPayout = 0;
    this.finalDivReinvestment = 0;
    this.finalTotalAmount = 0;
    this.finalGain = 0;
    this.finalAbsReturn = 0;
    this.finalXirr = 0;
    this.finalAllocationPer = 0;
    this.mutualFundList.forEach(element => {
      element.mutualFundTransactions.forEach(ele => {
        this.finalTotalTransactionAmt += (ele.amount) ? ele.amount : 0;
        this.finalTotalUnit += (ele.unit) ? ele.unit : 0;
        this.finalTotalNav += (ele.transactionNav) ? ele.transactionNav : 0;
        this.finalCurrentValue += (ele.currentValue) ? ele.currentValue : 0;
        this.finalDividendPayout += (ele.dividendPayout) ? ele.dividendPayout : 0;
        this.finalDivReinvestment += (ele.dividendReinvest) ? ele.dividendReinvest : 0;
        this.finalTotalAmount += (ele.totalAmount) ? ele.totalAmount : 0;
        this.finalGain += (ele.gain) ? ele.gain : 0;
        this.finalAbsReturn += (ele.absReturn) ? ele.absReturn : 0;
        this.finalXirr += (ele.xirr) ? ele.xirr : 0;
        this.finalAllocationPer += (ele.absoluteReturn) ? ele.absoluteReturn : 0;
      });
    })
  }
  getEachTotalValue(data) {//to calculate the total category wise
    this.totalTransactionAmt = 0;
    this.totalUnit = 0;
    this.totalNav = 0;
    this.currentValue = 0;
    this.dividendPayout = 0;
    this.divReinvestment = 0;
    this.totalAmount = 0;
    this.gain = 0;
    this.absReturn = 0;
    this.xirr = 0;
    this.amountInvested = 0;
    data.mutualFundTransactions.forEach(ele => {
      this.totalTransactionAmt += (ele.amount) ? ele.amount : 0;
      this.totalUnit += (ele.unit) ? ele.unit : 0;
      this.totalNav += (ele.transactionNav) ? ele.transactionNav : 0;
      this.currentValue += (ele.currentValue) ? ele.currentValue : 0;
      this.dividendPayout += (ele.dividendPayout) ? ele.dividendPayout : 0;
      this.divReinvestment += (ele.dividendReinvest) ? ele.dividendReinvest : 0;
      this.totalAmount += (ele.totalAmount) ? ele.totalAmount : 0;
      this.gain += (ele.gain) ? ele.gain : 0;
      this.absReturn += (ele.absReturn) ? ele.absReturn : 0;
      this.xirr += (ele.xirr) ? ele.xirr : 0;
      this.amountInvested += (ele.amountInvested) ? ele.xirr : 0;
    });
    const obj = {
      'total': 'Total',
      'totalTransactionAmt': this.totalTransactionAmt,
      'totalUnit': this.totalUnit,
      'totalNav': this.totalNav,
      'totalCurrentValue': this.currentValue,
      'dividendPayout': this.dividendPayout,
      'divReinvestment': this.divReinvestment,
      'totalAmount': this.totalAmount,
      'gain': this.gain,
      'absReturn': this.absReturn,
      'xirr': this.xirr,
      'amountInvested': this.amountInvested,
    }
    this.totalObj = obj
  }
  getCategoryWiseTotal(data) { //used for getting first table total values to display in table
    this.totalTransactionAmt += (data.amount) ? data.amount : 0;
    this.totalUnit += (data.unit) ? data.unit : 0;
    this.totalNav += (data.transactionNav) ? data.transactionNav : 0;
    this.currentValue += (data.currentValue) ? data.currentValue : 0;
    this.dividendPayout += (data.dividendPayout) ? data.dividendPayout : 0;
    this.divReinvestment += (data.dividendReinvest) ? data.dividendReinvest : 0;
    this.totalAmount += (data.totalAmount) ? data.totalAmount : 0;
    this.gain += (data.gain) ? data.gain : 0;
    this.absReturn += (data.absReturn) ? data.absReturn : 0;
    this.xirr += (data.xirr) ? data.xirr : 0;
    this.amountInvested += (data.amountInvested) ? data.amountInvested : 0;
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
