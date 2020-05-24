import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';
import { AuthService } from 'src/app/auth-service/authService';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MfServiceService {
  advisorData: any;
  constructor(private settingService: SettingsService, private authService: AuthService, private datePipe: DatePipe) {
  }

  private mutualFundDataSource = new BehaviorSubject('');
  private updateTransactionAfterAdd = new BehaviorSubject('');
  private showMutualFundDropdown = new BehaviorSubject('');
  private viewMode = new BehaviorSubject('');
  private mfData = new BehaviorSubject('');
  private navValue = new BehaviorSubject('');
  private filterValues = new BehaviorSubject('');
  private mfGetData = new BehaviorSubject('');
  private clientIdToClearData = new BehaviorSubject('');

  getPersonalDetails(data) {
    const obj = {
      id: data
    }
    this.settingService.getProfileDetails(obj).subscribe(
      data => {
        console.log(data)
        this.authService.setProfileDetails(data);
        this.advisorData = data;
      }
    );
    return this.advisorData;
  }
  subCatArrayForSummary = (mutualFundList, type) => {
    let reportType;
    (type == '' || type[0].name == 'Sub Category wise') ? reportType = 'subCategoryName' :
      (type[0].name == 'Category wise') ? reportType = 'categoryName' : reportType = 'ownerName';
    const filteredArray = [];
    let catObj;
    if (mutualFundList) {
      catObj = this.categoryFilter(mutualFundList, reportType);
      Object.keys(catObj).map(key => {
        filteredArray.push({ groupName: key });
        let totalObj: any = {};
        catObj[key].forEach((singleData) => {
          filteredArray.push(singleData);
          totalObj = this.addTwoObjectValues(this.calculateTotalValue(singleData), totalObj, { schemeName: true });
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
    data.folioWise = this.filter(data.schemeWise, 'mutualFund');
    return data;
  }
  filter(data, key) {// filtering data as per category
    const filterData = [];
    const finalDataSource = [];
    data.filter(element => {
      if ((element[key]) ? element[key].length > 0 : element[key]) {
        filterData.push(element[key]);
      }
    });
    if (filterData.length > 0) {
      filterData.forEach(element => {
        if (element.length > 0) {
          element.forEach(singleData => {
            finalDataSource.push(singleData);
          });
        } else {
          finalDataSource.push({});
        }

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
  getYearFromDate(date) { //for converting timeStampdate into year
    date = new Date(date);
    date = date.getFullYear();
    return date;
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
    absReturn += (data.absoluteReturn == 'Infinity' || data.absoluteReturn == '-Infinity' || data.absoluteReturn == 'NaN') ? 0 : (data.absoluteReturn) ? data.absoluteReturn : 0;
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
        if ((primaryObject[key] || primaryObject[key] == 0) && (secondary[key]) || secondary[key] == 0) {
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
    let netGain = 0;
    data.mutualFundTransactions.forEach(ele => {
      totalTransactionAmt += (ele.amount) ? ele.amount : 0;
      totalUnit += (ele.unit) ? ele.unit : 0;
      totalNav += (ele.transactionNav) ? ele.transactionNav : 0;
      balanceUnit += (ele.balanceUnits) ? ele.balanceUnits : 0;
      currentValue += (ele.currentValue) ? ele.currentValue : 0;
      dividendPayout += (ele.dividendPayout) ? ele.dividendPayout : 0;
      dividendReinvest += (ele.dividendReinvest) ? ele.dividendReinvest : 0;
      totalAmount += (ele.totalAmount) ? ele.totalAmount : 0;
      totalGain += (ele.unrealizedGain) ? ele.unrealizedGain : 0;
      netGain += (ele.gainOrLossAmount) ? ele.gainOrLossAmount : 0;
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
  sorting(data, filterId) {
    if(data){
      data.sort((a, b) =>
      a[filterId] > b[filterId] ? 1 : (a[filterId] === b[filterId] ? 0 : -1)
    );
    }


    return data
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
    let mutualFundList;
    const family_member_list = this.filterArray(mfData.family_member_list, 'id', dataForFilter.familyMember, 'familyMemberId');
    const category = this.filterArray(mfData.mutualFundCategoryMastersList, 'id', dataForFilter.category, 'categoryId');
    const subCategoryData = this.filter(category, 'mutualFundSubCategoryMaster');
    const schemeWiseFilter = this.filter(subCategoryData, 'mutualFundSchemeMaster');
    const schemeWise = this.filterArray(schemeWiseFilter, 'amc_id', dataForFilter.amc, 'amc_id');
    let mutualFundListFilter = this.filter(schemeWiseFilter, 'mutualFund');
    mutualFundList = this.filterArray(mutualFundListFilter, 'folioNumber', dataForFilter.folio, 'folioNumber');
    // dataForFilter.folio.forEach(element => {
    //   mutualFundList = mutualFundListFilter.filter((item: any) =>
    //  item.folioNumber == element.folioNumber
    //     );
    // });

    if (dataForFilter.showFolio == 2) {
      mutualFundList = mutualFundList.filter((item: any) =>
       (item.balanceUnit!=0 && item.balanceUnit > 0) || item.folioNumber != 0 
      );
    }
    // if (dataForFilter.name == 'ALL TRANSACTION REPORT' || dataForFilter.name == 'UNREALIZED TRANSACTION REPORT') {
    //   dataForFilter.reportAsOn = null;
    // }
    if (dataForFilter.reportAsOn && (dataForFilter.name == 'ALL TRANSACTION REPORT' || dataForFilter.name == 'UNREALIZED TRANSACTION REPORT')) {
      mutualFundList.forEach(element => {
        element.mutualFundTransactions = element.mutualFundTransactions.filter((item: any) =>
          this.datePipe.transform(item.transactionDate, 'yyyy-MM-dd') <= dataForFilter.reportAsOn
        );
      });
    }
    if (dataForFilter.transactionPeriodCheck) {
      if (dataForFilter.fromDate && dataForFilter.toDate) {
        mutualFundList.forEach(element => {
          element.mutualFundTransactions = element.mutualFundTransactions.filter((item: any) =>
            item.transactionDate >= dataForFilter.fromDate && item.transactionDate <= dataForFilter.toDate
          );
        });
      }
    }

    // let type = dataForFilter.reportType[0].name;
    // (type == 'Sub Category wise') ? type = 'subCategoryName' :
    // (type== 'Category wise') ? type = 'categoryName' : type = 'Investor wise';
    // let catObj = this.categoryFilter(mutualFundList, type);
    // console.log(catObj)
    // let categoryWiseMfList = catObj;
    // Object.keys(catObj).map(key => {
    //   catObj[key].forEach((singleData) => {
    //     singleData.navDate =  this.datePipe.transform(singleData.navDate, 'yyyy-MM-dd')
    //    singleData.mutualFundTransactions.forEach(element => {
    //     element.transactionDate =  this.datePipe.transform(element.transactionDate, 'yyyy-MM-dd')
    //    });
    //   });
    // });
    let categoryWiseMfList = [];
    mutualFundList.forEach(element => {
      categoryWiseMfList.push(element.id)
    });

    let capitalGainArray = [];
    if (dataForFilter.capitalGainData) {
      dataForFilter.capitalGainData.responseData.forEach(element => {
        const family_member_list = this.filterArray(element.mutualFund, 'familyMemberId', dataForFilter.familyMember, 'familyMemberId');
        if (family_member_list.length > 0) {
          capitalGainArray.push(element)
        }
      });
      dataForFilter.capitalGainData.responseData = capitalGainArray;
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
      overviewFilter: dataForFilter.overviewFilter,
      reportFormat: dataForFilter.reportFormat,
      financialYear: dataForFilter.financialYear,
      grandfathering: dataForFilter.grandfathering,
      mfData,
      capitalGainData: dataForFilter.capitalGainData,
      categoryWiseMfList: categoryWiseMfList,
      transactionPeriodCheck:dataForFilter.transactionPeriodCheck,
      transactionPeriod:dataForFilter.transactionPeriod
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

  sendMutualFundData(data) {
    this.mutualFundDataSource.next(data);
  }
  setFilterData(originalData,rightSideData,displayColumns){
    let date = new Date();
    let filterData;
    let transactionView = [];
    if(rightSideData){
      filterData = rightSideData.mfData
    }
    let schemWise = []
    let amcWiseData = originalData.schemeWise; 
    let folio = this.getReportFilterData(originalData.mutualFundList,(filterData) ? filterData.mutualFundList : '','folioNumber','folioNumber');
    let category = this.getReportFilterData(originalData.mutualFundCategoryMastersList,(filterData) ? filterData.mutualFundCategoryMastersList : '','id','id');
     let familyMember = this.getReportFilterData(originalData.family_member_list,(filterData) ? filterData.family_member_list:'','id','id');
     let amc = this.getReportFilterData(amcWiseData,(filterData) ? filterData.schemeWise : '','amc_id','amc_id');
     displayColumns.forEach(element => {
       if(element.displayName){
        const obj = {
          displayName: element.displayName,
          selected:true
        };
        transactionView.push(obj);
       }
      });
      transactionView = this.getOtherFilter(transactionView,(rightSideData) ? rightSideData.transactionView : '','selected','selected','displayName')
      let overviewFilter = [{ name: 'Summary bar', selected: true },
      { name: 'Scheme wise allocation', selected: true },
      { name: 'Cashflow Status', selected: true },
      { name: 'Family Member wise allocation', selected: true },
      { name: 'Category wise allocation', selected: true },
      { name: 'Sub Category wise allocation', selected: true }];
      overviewFilter = this.getOtherFilter(overviewFilter,(rightSideData) ? rightSideData.overviewFilter : '','selected','selected','name')
     originalData.mutualFundList.forEach(element => {
        const obj = {
        id: element.schemeId,
        schemeName: element.schemeName,
        amc_name: element.amcName,
        mutualFund: element.mutualFund,
        amc_id: element.amcId,
        currentValue : element.currentValue,
     
      };
      schemWise.push(obj);
     });
     let scheme = this.getReportFilterData(schemWise,(filterData) ? filterData.schemeWise:'','id','id');
    const obj={
      schemeWise:amc,
      folioWise:folio,
      category:category,
      familyMember:familyMember,
      scheme:scheme,
      transactionView:transactionView,
      reportType :(rightSideData) ? (rightSideData.reportType.length > 0 ? rightSideData.reportType[0].name : 'Sub Category wise') : 'Sub Category wise',
      reportAsOn:(rightSideData) ? rightSideData.reportAsOn : new Date(),
      showFolio : (rightSideData) ? rightSideData.showFolio : '2',
      fromDate :(rightSideData) ? rightSideData.fromDate : new Date(date.setFullYear(date.getFullYear() - 1)),
      toDate :(rightSideData) ? rightSideData.toDate: new Date(),
      overviewFilter:overviewFilter,
      transactionPeriod:(rightSideData) ? rightSideData.transactionPeriod : false,
      transactionPeriodCheck:(rightSideData) ? rightSideData.transactionPeriodCheck : false

    }
    return obj;
  }
  getOtherFilter(orgData,filterData,orgId,FilterId,name){
    if(filterData){
      // orgData.forEach(item => item.selected = '');
      filterData.forEach(element => {
        orgData.forEach(item => {
          if((item[orgId] != element[FilterId]) && item[name] == element[name]){
            item.selected = false;
          }
        });
      });
    }else{
      orgData.forEach(item => item.selected = true);
    }
      // orgData.forEach(element => {
      //   if(element.selected == ''){
      //     element.selected = false;
      //   }
      // });
    // orgData = [...new Map(orgData.map(item => [item[orgId], item])).values()];
    return orgData;
  }
  getReportFilterData(orgData,filterData,orgId,FilterId){
    // if(rightSideData){
    //   filterData = rightSideData.mfData;
    // }
    orgData = orgData.filter((item: any) =>
    (item.currentValue!=0 && item.currentValue > 0)
    );
 
    if(filterData ? (filterData.length != orgData.length) : filterData){
      filterData = filterData.filter((item: any) =>
      (item.currentValue!=0 && item.currentValue > 0)
      );
      orgData.forEach(item => item.selected = '');
      filterData.forEach(element => {
        orgData.forEach(item => {
          if(item[orgId] == element[FilterId]){
            item.selected = true;
          }
        });
      });
    }else{
      orgData.forEach(item => item.selected = true);
    }
      orgData.forEach(element => {
        if(element.selected == ''){
          element.selected = false;
        }
      });
    orgData = [...new Map(orgData.map(item => [item[orgId], item])).values()];
    return orgData;
  }

  clearStorage(){
    this.setFilterValues('');
    this.setDataForMfGet('');
    this.setMfData('');
  }
  getMutualFundData() {
    return this.mutualFundDataSource.asObservable();
  }

  sendUpdatedTransactionAfterAdd(value) {
    this.updateTransactionAfterAdd.next(value);
  }

  getUpdatedTransactionAfterAdd() {
    return this.updateTransactionAfterAdd.asObservable();
  }

  changeShowMutualFundDropDown(value) {
    this.showMutualFundDropdown.next(value);
  }

  getMutualFundShowDropdown() {
    return this.showMutualFundDropdown.asObservable();
  }
  changeViewMode(value) {
    this.viewMode.next(value);
  }

  getViewMode() {
    return this.viewMode.asObservable();
  }
  setMfData(value) {
    this.mfData.next(value);
  }

  getMfData() {
    return this.mfData.asObservable();
  }
  setNavValue(value) {
    this.navValue.next(value);
  }

  getNavValue() {
    return this.navValue.asObservable();
  }
  setFilterValues(value) {
    this.filterValues.next(value);
  }
  getFilterValues() {
    return this.filterValues.asObservable();
  }
  setDataForMfGet(value){
    this.mfGetData.next(value);
  }
  getDataForMfGet(){
    return this.mfGetData.asObservable();
  }
  setClientId(value){
    this.clientIdToClearData.next(value);
  }
  getClientId(){
    return this.clientIdToClearData.asObservable();
  }
}
