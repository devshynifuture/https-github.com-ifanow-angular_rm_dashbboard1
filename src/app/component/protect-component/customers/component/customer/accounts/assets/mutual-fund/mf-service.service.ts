import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MfServiceService {
  filteredArray: any[];
  amtInvested: any;
  currentValue: any;
  unrealizedGainLoss: any;
  absReturn: any;
  xirr: any;
  withdrawals: any;
  balanceUnit: any;
  divPayout: any;
  sip: any;
  totalObj: any;
  totalTransactionAmt: number;
  totalUnit: number;
  totalNav: number;
  dividendPayout: any;
  dividendReinvest: any;
  totalAmount: any;
  totalGain: any;
  allocationPer: any;
  constructor() { }

  filter(data, key) {//filtering data as per category
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
    return this.filteredArray
  }
  initializeValues() {
    this.amtInvested = 0;
    this.currentValue = 0;
    this.unrealizedGainLoss = 0;
    this.absReturn = 0;
    this.xirr = 0;
    this.withdrawals = 0;
    this.balanceUnit = 0;
    this.divPayout = 0;
    this.sip = 0;
    this.totalTransactionAmt = 0;
    this.totalUnit = 0;
    this.totalNav = 0;
    this.dividendPayout =0;
    this.dividendReinvest = 0;
    this.totalAmount =0;
    this.totalGain = 0;
    this.allocationPer = 0;
  }
  calculateTotalValue(data) {//for getting total value as per category in Summary
    this.amtInvested += (data.amountInvested) ? data.amountInvested : 0;
    this.currentValue += (data.currentValue) ? data.currentValue : 0;
    this.unrealizedGainLoss += (data.unrealizedGain) ? data.unrealizedGain : 0;
    this.absReturn += (data.absoluteReturn) ? data.absoluteReturn : 0;
    this.xirr += (data.xirr) ? data.xirr : 0;
    this.divPayout += (data.dividendPayout) ? data.dividendPayout : 0;
    this.withdrawals += (data.switchOut) ? data.switchOut : 0;
    this.balanceUnit += (data.balanceUnit) ? data.switchOut : 0;
    this.sip += (data.sipAmount) ? data.sipAmount : 0;
    const obj = {
      'total': 'Total',
      'amountInvested': this.amtInvested,
      'currentValue': this.currentValue,
      'unrealizedGain': this.unrealizedGainLoss,
      'absoluteReturn': this.absReturn,
      'xirr': this.xirr,
      'dividendPayout': this.divPayout,
      'switchOut': this.withdrawals,
      'balanceUnit': this.balanceUnit,
      'sipAmount': this.sip
    }
    this.totalObj = obj
    return this.totalObj
  }
  getEachTotalValue(data) { //get total value as per category for transaction
    data.mutualFundTransactions.forEach(ele => {
      this.totalTransactionAmt += (ele.amount) ? ele.amount : 0;
      this.totalUnit += (ele.unit) ? ele.unit : 0;
      this.totalNav += (ele.transactionNav) ? ele.transactionNav : 0;
      this.balanceUnit += (ele.balanceUnits) ? ele.balanceUnits : 0;
      this.currentValue += (ele.currentValue) ? ele.currentValue : 0;
      this.dividendPayout += (ele.dividendPayout) ? ele.dividendPayout : 0;
      this.dividendReinvest += (ele.dividendReinvest) ? ele.dividendReinvest : 0;
      this.totalAmount += (ele.totalAmount) ? ele.totalAmount : 0;
      this.totalGain += (ele.gain) ? ele.gain : 0;
      this.absReturn += (ele.absReturn) ? ele.absReturn : 0;
      this.xirr += (ele.xirr) ? ele.xirr : 0;
      this.allocationPer += (ele.allocationPercent) ? ele.allocationPercent : 0;
    });
    const obj = {
      'total': 'Total',
      'totalTransactionAmt': this.totalTransactionAmt,
      'totalUnit': this.totalUnit,
      'totalNav': this.totalNav,
      'totalBalanceUnit': this.balanceUnit,
      'currentValue':this.currentValue,
      'dividendPayout':this.dividendPayout, 
      'dividendReinvest':this.dividendReinvest, 
      'totalAmount':this.totalAmount,
      'totalGain' :this.totalGain,
      'absReturn':this.absReturn,
      'xirr' :this.xirr,
      'allocationPer':this.allocationPer
    }
    this.totalObj = obj
    return this.totalObj;
  }
  categoryFilter(data) {
    let catObj = {};
    const categoryArray = [];
    data.forEach(ele => {
      if (ele.subCategoryName) {
        const categoryArray = catObj[ele.subCategoryName] ? catObj[ele.subCategoryName] : [];
        categoryArray.push(ele);
        catObj[ele.subCategoryName] = categoryArray;
      } else {
        categoryArray.push(ele);
      }
    });
    return catObj;
  }
  filterScheme(data){
    let filterData = [];
    let filterData2 = [];
    let filterData3 = [];
    let filterData4 = [];
    let sendData={};
    data.filter(function (element) {
      if (element.selected == true) {
        element.mutualFund.forEach(ele => {
          const obj = {
            "folioNumber": ele.folioNumber,
            "selected": true
          }
          const obj2 = {
            "name": ele.ownerName,
            "familyMemberId": ele.familyMemberId,
            "selected": true
          }
          const obj3 = {
            "category": ele.categoryName,
            "categoryId": ele.categoryId,
            "selected": true
          }
          filterData.push(obj);
          filterData2.push(obj2);
          filterData3.push(obj3)
        });
        const obj = {
          "amc_name": element.amc_name,
          "schemeName": element.schemeName,
          "mutualFund": element.mutualFund,
          "id": element.id,
          "amc_id": element.amc_id,
          "selected": true
        }
        filterData4.push(obj);
      }
    })
    sendData={
      filterData:filterData,
      filterData2:filterData2,
      filterData3:filterData3,
      filterData4:filterData4
    }
    return sendData;
  }
}
