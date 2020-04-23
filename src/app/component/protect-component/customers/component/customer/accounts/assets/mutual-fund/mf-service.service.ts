import {Injectable} from '@angular/core';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';

@Injectable({
  providedIn: 'root'
})
export class MfServiceService {
  advisorData: any;
  constructor(private settingService:SettingsService) {
  }

  getPersonalDetails(data){
    const obj={
      id:data
    }
   this.settingService.getProfileDetails(obj).subscribe(
      data => {
        console.log(data)
        this.advisorData = data;
      }
    );
    return this.advisorData;
  }
  subCatArrayForSummary = (mutualFundList, type) => {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'name';
    const filteredArray = [];
    let catObj;
    if (mutualFundList) {
      catObj = this.categoryFilter(mutualFundList, reportType);
      Object.keys(catObj).map(key => {
        filteredArray.push({groupName: key});
        let totalObj: any = {};
        catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          totalObj = this.addTwoObjectValues(this.calculateTotalValue(singleData), totalObj, {schemeName: true});
        });
        filteredArray.push(totalObj);
      });
      console.log(filteredArray);
      return filteredArray;
    }
  }
 doFiltering(data) {
    data.subCategoryData = this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    data.schemeWise = this.filter(data.subCategoryData, 'mutualFundSchemeMaster');
    data.mutualFundList = this.filter(data.schemeWise, 'mutualFund');
    return data;
  }
  filter(data, key) {// filtering data as per category
    const filterData = [];
    const finalDataSource = [];
    data.filter(element => {
      filterData.push(element[key]);
    });
    if (filterData.length > 0) {
      filterData.forEach(element => {
        element.forEach(singleData => {
          finalDataSource.push(singleData);
        });
      });
    }
    return finalDataSource;
  }

  initializeValues() {
    // this.amtInvested = 0;
    // this.currentValue = 0;
    // this.unrealizedGainLoss = 0;
    // this.absReturn = 0;
    // this.xirr = 0;
    // this.withdrawals = 0;
    // this.balanceUnit = 0;
    // this.divPayout = 0;
    // this.sip = 0;
    // this.totalTransactionAmt = 0;
    // this.totalUnit = 0;
    // this.totalNav = 0;
    // this.dividendPayout = 0;
    // this.dividendReinvest = 0;
    // this.totalAmount = 0;
    // this.totalGain = 0;
    // this.allocationPer = 0;
  }

  calculateTotalValue(data) {// for getting total value as per category in Summary
    let amtInvested = 0;
    let currentValue = 0;
    let unrealizedGainLoss = 0;
    let absReturn = 0;
    let xirr = 0;
    let withdrawals = 0;
    let balanceUnit = 0;
    let divPayout = 0;
    let sip = 0;
    amtInvested += (data.amountInvested) ? data.amountInvested : 0;
    currentValue += (data.currentValue) ? data.currentValue : 0;
    unrealizedGainLoss += (data.unrealizedGain) ? data.unrealizedGain : 0;
    absReturn += (data.absoluteReturn) ? data.absoluteReturn : 0;
    xirr += (data.xirr) ? data.xirr : 0;
    divPayout += (data.dividendPayout) ? data.dividendPayout : 0;
    withdrawals += (data.switchOut) ? data.switchOut : 0;
    balanceUnit += (data.balanceUnit) ? data.switchOut : 0;
    sip += (data.sipAmount) ? data.sipAmount : 0;
    const obj = {
      schemeName: 'Total',
      totalAmountInvested: amtInvested,
      totalCurrentValue: currentValue,
      totalUnrealizedGain: unrealizedGainLoss,
      totalAbsoluteReturn: absReturn,
      totalXirr: xirr,
      totalDividendPayout: divPayout,
      totalSwitchOut: withdrawals,
      totalBalanceUnit: balanceUnit,
      totalSipAmount: sip
    };
    // this.totalObj = obj;
    return obj;
  }

  addTwoObjectValues(primaryObject, secondary, exceptionKeys) {
    for (const [key, value] of Object.entries(primaryObject)) {
      if (exceptionKeys[key]) {
      } else {
        if (primaryObject[key] && secondary[key]) {
          primaryObject[key] = value + secondary[key];
        }
      }
      console.log(key, value);
    }
    return primaryObject;
  }

  getEachTotalValue(data) { // get total value as per category for transaction
    let currentValue = 0;
    let absReturn = 0;
    let xirr = 0;
    let balanceUnit = 0;
    let totalTransactionAmt = 0;
    let totalUnit = 0;
    let totalNav = 0;
    let dividendPayout = 0;
    let dividendReinvest = 0;
    let totalAmount = 0;
    let totalGain = 0;
    let allocationPer = 0;
    data.mutualFundTransactions.forEach(ele => {
      totalTransactionAmt += (ele.amount) ? ele.amount : 0;
      totalUnit += (ele.unit) ? ele.unit : 0;
      totalNav += (ele.transactionNav) ? ele.transactionNav : 0;
      balanceUnit += (ele.balanceUnits) ? ele.balanceUnits : 0;
      currentValue += (ele.currentValue) ? ele.currentValue : 0;
      dividendPayout += (ele.dividendPayout) ? ele.dividendPayout : 0;
      dividendReinvest += (ele.dividendReinvest) ? ele.dividendReinvest : 0;
      totalAmount += (ele.totalAmount) ? ele.totalAmount : 0;
      totalGain += (ele.gain) ? ele.gain : 0;
      absReturn += (ele.absReturn) ? ele.absReturn : 0;
      xirr += (ele.xirr) ? ele.xirr : 0;
      allocationPer += (ele.allocationPercent) ? ele.allocationPercent : 0;
    });
    const obj = {
      total: 'Total',
      totalTransactionAmt,
      totalUnit,
      totalNav,
      totalBalanceUnit: balanceUnit,
      currentValue,
      dividendPayout,
      dividendReinvest,
      totalAmount,
      totalGain,
      absReturn,
      xirr,
      allocationPer
    };
    // this.totalObj = obj;
    return obj;
  }

  categoryFilter(data, type) {
    const catObj = {};
    const categoryArray = [];
    data.forEach(ele => {
      if (ele[type]) {
        const categoryArrayLocal = catObj[ele[type]] ? catObj[ele[type]] : [];
        categoryArrayLocal.push(ele);
        catObj[ele[type]] = categoryArrayLocal;
      } else {
        categoryArray.push(ele);
      }
    });
    return catObj;
  }

  filterScheme(data) {
    const filterData = [];
    const filterData2 = [];
    const filterData3 = [];
    const filterData4 = [];
    let sendData = {};
    data.filter(element => {
      if (element.selected) {
        element.mutualFund.forEach(ele => {
          const obj = {
            folioNumber: ele.folioNumber,
            selected: true
          };
          const obj2 = {
            name: ele.ownerName,
            familyMemberId: ele.familyMemberId,
            selected: true
          };
          const obj3 = {
            category: ele.categoryName,
            categoryId: ele.categoryId,
            selected: true
          };
          filterData.push(obj);
          filterData2.push(obj2);
          filterData3.push(obj3);
        });
        const obj = {
          amc_name: element.amc_name,
          schemeName: element.schemeName,
          mutualFund: element.mutualFund,
          id: element.id,
          amc_id: element.amc_id,
          selected: true
        };
        filterData4.push(obj);
      }
    });
    sendData = {
      filterData,
      filterData2,
      filterData3,
      filterData4
    };
    return sendData;
  }

  filterFinalData(mfData, dataForFilter) {
    const family_member_list = this.filterArray(mfData.family_member_list, 'id', dataForFilter.familyMember, 'familyMemberId');
    const category = this.filterArray(mfData.mutualFundCategoryMastersList, 'id', dataForFilter.category, 'categoryId');
    const subCategoryData = this.filter(category, 'mutualFundSubCategoryMaster');
    const schemeWiseFilter = this.filter(subCategoryData, 'mutualFundSchemeMaster');
    const schemeWise = this.filterArray(schemeWiseFilter, 'amc_id', dataForFilter.amc, 'amc_id');
    const mutualFundListFilter = this.filter(schemeWiseFilter, 'mutualFund');
    let mutualFundList = this.filterArray(mutualFundListFilter, 'folioNumber', dataForFilter.folio, 'folioNumber');
    if (dataForFilter.showFolio == 2) {
      mutualFundList = mutualFundList.filter((item: any) =>
        item.folioNumber != 0
      );
    }
    if (dataForFilter.reportAsOn) {
      mutualFundList.forEach(element => {
        element.mutualFundTransactions = element.mutualFundTransactions.filter((item: any) =>
          item.transactionDate <= dataForFilter.reportAsOn
        );
      });
    }
    if (dataForFilter.fromDate && dataForFilter.toDate) {
      mutualFundList.forEach(element => {
        element.mutualFundTransactions = element.mutualFundTransactions.filter((item: any) =>
          item.transactionDate >= dataForFilter.fromDate && item.transactionDate <= dataForFilter.toDate
        );
      });
    }
    const sendData = {
      subCategoryData,
      family_member_list,
      category,
      schemeWise,
      mutualFundList,
      reportAsOn: dataForFilter.reportAsOn,
      fromDate: dataForFilter.fromDate,
      toDate: dataForFilter.toDate,
      showFolio: dataForFilter.showFolio,
      reportType: dataForFilter.reportType,
      transactionView: dataForFilter.transactionView,
      overviewFilter : dataForFilter.overviewFilter,
      mfData,
    };
    return sendData;
  }

  filterArray(data, dataKey, filterData, filterDataKey) {
    const filter = [];
    filterData.forEach(ele => {
      data.forEach(element => {
        if (element[dataKey] == ele[filterDataKey]) {
          filter.push(element);
        }
      });
    });
    return filter;
  }
}
