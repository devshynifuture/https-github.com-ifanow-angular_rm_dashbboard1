import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MfServiceService } from '../../mf-service.service';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { MutualFundAllTransactionComponent } from '../mutual-fund-all-transaction/mutual-fund-all-transaction.component';

@Component({
  selector: 'app-mf-capital-detailed',
  templateUrl: './mf-capital-detailed.component.html',
  styleUrls: ['./mf-capital-detailed.component.scss']
})
export class MfCapitalDetailedComponent implements OnInit {
  displayedColumns: string[] = ['dateRedeem', 'trnRedeem', 'amtRedeem', 'sttRedeem', 'unitsRedeem', 'rateRedeem', 'datePurchase', 'amtPurchase', 'unitsPurchase', 'ratePurchase', 'stGainPurchase', 'stLossPurchase', 'ltGainPurchase', 'ltLossPurchase', 'indGainPurchase', 'indLossPurchase', 'daysPurchase'];
  displayedColumns1: string[] = ['schemeName1', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  displayedColumns2: string[] = ['schemeName2', 'folioNumber', 'dividendPayoutAmount', 'dividendReInvestmentAmount', 'totalReinvestmentAmount'];
  dataSource = new MatTableDataSource([{}, {}, {}]);
  dataSource1 = new MatTableDataSource([{}, {}, {}]);
  dataSource2 = new MatTableDataSource([{}, {}, {}]);
  isLoading =false;
  total_stGain = 0;
  total_ltGain = 0;
  total_stLoss = 0;
  total_indexGain = 0;
  total_ltLoss = 0;
  total_indexLoss = 0;
  purchaseAmount = 0;
  redeemAmount = 0;
  total_stt = 0;
  totalReinvesment = 0;
  totaldividendPayout = 0;
  totaldividendReinvestment = 0;
  mfList: any;
  equityObj: any;
  debtObj: any;
  rightFilterData: any;
  fromDateYear: number;
  toDateYear: number;
  grandFatheringEffect = false;
  redemption: any[];
  objSendToDetailedCapital:any;
  mutualFundList: any[];
  fromDate: Date;
  toDate: Date;
  constructor(private MfServiceService:MfServiceService,private subInjectService : SubscriptionInject) { }
   @Output() reponseToInput = new EventEmitter();
   @Output() changeInput = new EventEmitter();
   @Input() responseData; 
   @Input() changedData;
   @Input() mutualFund;
  ngOnInit() {
    this.isLoading =true;
    setTimeout(() => {
      console.log('response data:',this.responseData);  // You will get the @Input value

      this.mutualFundList = this.MfServiceService.filter(this.responseData, 'mutualFund');
      this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
      if(this.changedData){
        this.fromDateYear = this.changedData.fromDateYear;
        this.fromDate =new Date(this.fromDateYear, 3, 1); 
        this.toDateYear = this.changedData.toDateYear ;
        this.toDate =new Date(this.toDateYear, 2, 31); 
        this.grandFatheringEffect =  (this.changedData.grandfatheringEffect == 1) ? this.grandFatheringEffect = true : this.grandFatheringEffect = false;;
        this.getDetailedData(this.changedData.mfListData);
    
      }
      // this.mfList = this.responseData.mfData;


  });
  }
  getDetailedData(data){
    let equityData=[];
    this.total_stGain = 0;
    this.total_ltGain= 0;
    this.total_stLoss= 0;
    this.total_ltLoss = 0;
    this.total_indexGain = 0;
    this.total_indexLoss = 0;
    this.purchaseAmount= 0;
    this.redeemAmount = 0;
    this.total_stt =0;
    this.isLoading =false;
    this.changeInput.emit(false);
    if(data){

      let catObj = this.MfServiceService.categoryFilter(data, 'category');
      Object.keys(catObj).map(key => {
        if(catObj[key][0].category != 'DEBT'){
          // this.dataSource =  new MatTableDataSource(this.getFilterData(catObj[key], 'EQUITY'));
          let tempData = this.getFilterData(catObj[key], 'EQUITY');
          equityData.push(...tempData)
          // equityData = this.getFilterData(catObj[key], key);
        }
      });
      this.dataSource = new MatTableDataSource(equityData);
      this.dataSource1 =  new MatTableDataSource(this.getFilterData( catObj['DEBT'],'DEBT'))
      this.dataSource2 = new MatTableDataSource(this.getDividendSummaryData(data));
      this.objSendToDetailedCapital={
        // mfData:this.mutualFund,
        responseData :this.responseData ,
        grandFatheringEffect:this.grandFatheringEffect,
        redemptionList:this.redemption,
        mutualFundList:this.mutualFundList,
        fromDateYear:this.fromDateYear,
        toDateYear:this.toDateYear,
      } 
    }
  }
  openFilter() {
    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterComponent
    };
  fragmentData.data = {
    name: 'CAPITAL GAIN REPORT',
    mfData: this.mutualFund,
    folioWise: this.mutualFund.mutualFundList,
    schemeWise: this.mutualFund.schemeWise,
    familyMember: this.mutualFund.family_member_list,
    category: this.mutualFund.mutualFundCategoryMastersList,
    transactionView: this.displayedColumns,
    capitalGainData:this.objSendToDetailedCapital,
  };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data && sideBarData.data != 'Close') {
            this.rightFilterData = sideBarData.data;
            const obj={
              data:this.rightFilterData.capitalGainData.responseData,
              summaryView:(this.rightFilterData.reportFormat[0].name == 'Detailed') ? false : true,
              grandfatheringEffect : this.rightFilterData.grandfathering,
              fromDateYear : (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].from : 2019,
              toDateYear : (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020
            }
            
            this.reponseToInput.emit(obj);
            // (this.rightFilterData.reportFormat[0].name == 'Detailed') ?  this.reponseToInput.emit(false): this.reponseToInput.emit(true);;
            (this.rightFilterData.grandfathering == 1) ? this.grandFatheringEffect = true : this.grandFatheringEffect = false;
            this.fromDateYear = (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].from : 2019;
            this.fromDate =new Date(this.fromDateYear, 3, 1); 
            this.toDateYear =(this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020;
            this.toDate =new Date(this.toDateYear, 2, 31); 
            if(this.rightFilterData.reportFormat[0].name == 'Detailed'){
              this.getDetailedData(this.rightFilterData.capitalGainData.responseData);
            }
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  getFilterData(data,category){
    if(data){

      let filteredArray = [];    
      let totalValue: any ={};
      let categoryWiseTotal:any ={};
      let mfList = this.MfServiceService.filter(data, 'mutualFund');
      mfList.forEach(element => {
        const startObj={
          schemeName:element.schemeName,
          folioNumber:element.folioNumber,
          ownerName:element.ownerName,
        }
        let totalObj: any = {};
        if((element.redemptionTransactions) ? (element.redemptionTransactions.length > 0) : element.redemptionTransactions){
          filteredArray.push(startObj);
          element.redemptionTransactions.forEach(obj => {
            

            // let financialyear = this.MfServiceService.getYearFromDate(obj.transactionDate)
            let trnDate = new Date(obj.transactionDate)
            if(trnDate >= this.fromDate && trnDate <= this.toDate){
              
              if(obj.purchaceAgainstRedemptionTransactions || (obj.purchaceAgainstRedemptionTransactions) ? obj.purchaceAgainstRedemptionTransactions.length > 0 :obj.purchaceAgainstRedemptionTransactions){
                obj.purchaceAgainstRedemptionTransactions.forEach((ele,ind) => {
                  totalObj = this.getFilteredValues(ele,category);
                  ele.stGain = totalObj.stGain;
                  ele.ltGain = totalObj.ltGain;
                  ele.stLoss = totalObj.stLoss;
                  ele.ltLoss = totalObj.ltLoss;
                  ele.indexGain = totalObj.indexGain;
                  ele.indexLoss = totalObj.indexLoss;
                  ele.purchasePrice = (this.grandFatheringEffect) ? ele.grandFatheringPurchasePrice : ele.purchasePrice;
                  ele.amount = (this.grandFatheringEffect) ? (ele.unit * ele.grandFatheringPurchasePrice) : ele.amount;
                  if(ind == 0){
                  ele.redeemTransactionDate = (obj.transactionDate) ? obj.transactionDate : 0;
                  ele.transactionType = (obj.fwTransactionType) ? obj.fwTransactionType : 0;
                  ele.redeemAmount = (obj.amount) ? obj.amount : 0;
                  ele.redeemStt = (obj.stt) ? obj.stt:0;
                  ele.redeemUnit = (obj.unit) ? obj.unit : 0;
                  ele.redeemRate = (obj.purchasePrice) ? obj.purchasePrice :0;
                  }
                  filteredArray.push(ele)
                  totalValue = this.MfServiceService.addTwoObjectValues(this.calculateTotalValue(ele), totalValue, {totalAmt: true});
      
              });
              }
              // }else{
              //   obj.purchaceAgainstRedemptionTransactions =[];
              //   const array={
              //     redeemTransactionDate : (obj.transactionDate) ? obj.transactionDate : 0,
              //     transactionType : (obj.fwTransactionType) ? obj.fwTransactionType : 0,
              //     redeemAmount : (obj.amount) ? obj.amount : 0,
              //     redeemStt :  (obj.stt) ? obj.stt:0,
              //     redeemUnit :(obj.unit) ? obj.unit : 0,
              //     redeemRate : (obj.purchasePrice) ? obj.purchasePrice :0,
              //     stGain :0,
              //     ltGain :0,
              //     stLoss :0,
              //     ltLoss :0,
              //     indexGain :0,
              //     indexLoss :0,
              //     transactionDate:'',
              //     amount:0,
              //     unit:0,
              //     purchasePrice:0,
              //     days:0
              //   }
              //   filteredArray.push(array)
              //   totalValue = this.MfServiceService.addTwoObjectValues(this.calculateTotalValue(array), totalValue, {totalAmt: true});
              // }
            }
    
          });
            if(Object.keys(totalValue).length != 0){
              this.getFinalTotalValue(totalValue);
              filteredArray.push(totalValue)
              let filterr ={
                totalAmt:'Total',
                totalAmount :totalValue.totalAmount,
                totalStt: totalValue.totalStt,
                purchaseAmount:totalValue.purchaseAmount,
                totalStGain  :totalValue.totalStGain,
                totalLtGain :totalValue.totalLtGain,
                totalStLoss  :totalValue.totalStLoss,
                totalLtLoss  :totalValue.totalLtLoss,
                totalIndexGain :totalValue.totalIndexGain,
                totalIndexLoss :totalValue.totalIndexLoss
              }
              categoryWiseTotal = this.MfServiceService.addTwoObjectValues(filterr, categoryWiseTotal, {totalAmt: true});
              totalValue = {};
            }

        }else{
          if(filteredArray.length > 0){
            if(filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].schemeName || filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].ownerName){
              filteredArray.pop();
            }
          }
        }
        if(filteredArray.length > 0){
          if(filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].schemeName || filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].ownerName){
            filteredArray.pop();
          }
        }
      });
      if(filteredArray.length > 0){
        if(filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].schemeName || filteredArray[filteredArray.length - 1].folioNumber || filteredArray[filteredArray.length - 1].ownerName){
          filteredArray.pop();
        }
      }

      (category == 'DEBT') ? this.debtObj =categoryWiseTotal : this.equityObj =categoryWiseTotal;
      console.log('DEBT',this.debtObj);
      console.log('EQUITY',this.equityObj);
      categoryWiseTotal={};

      return filteredArray;
    }

  }

  getFilteredValues(data, category) {
    let days;
    let gainLossBasedOnGrandfathering;
    (category == 'DEBT') ? days = 1095 : days = 365;
    (this.grandFatheringEffect) ? gainLossBasedOnGrandfathering = 'grandFatheringGainOrLossAmount' : gainLossBasedOnGrandfathering= 'gainOrLossAmount' ;
    let stGain;
    let ltGain;
    let stLoss;
    let ltLoss;
    let indexGain;
    let indexLoss;

      if (data.days < days) {
        stGain = ((data[gainLossBasedOnGrandfathering] >= 0) ? (data[gainLossBasedOnGrandfathering]) : 0)
        stLoss = ((data[gainLossBasedOnGrandfathering] < 0) ? (data[gainLossBasedOnGrandfathering]) : 0)
      } else {
        ltGain = ((data[gainLossBasedOnGrandfathering] >= 0) ? data[gainLossBasedOnGrandfathering] : 0);
        ltLoss = ((data[gainLossBasedOnGrandfathering] < 0) ? data[gainLossBasedOnGrandfathering] : 0);
      }
      indexGain = ((data.indexGainOrLoss >= 0) ? (data.indexGainOrLoss) : 0)
      indexLoss = ((data.indexGainOrLoss < 0) ? (data.indexGainOrLoss) : 0)
    
    let obj = {
      stGain: (stGain) ? stGain : 0,
      ltGain: (ltGain) ? ltGain : 0,
      stLoss: (stLoss) ? stLoss :0,
      ltLoss: (ltLoss) ? ltLoss : 0,
      indexGain: (indexGain) ? indexGain :0,
      indexLoss: (indexLoss) ? indexLoss :0
    };
    return obj;
  }
  calculateTotalValue(data){
    let totalAmount = 0;
    let totalStt = 0
    let purchaseAmount = 0;
    let totalStGain =0;
    let totalLtGain=0;
    let totalStLoss =0;
    let totalLtLoss =0;
    let totalIndexGain=0;
    let totalIndexLoss=0;
    totalAmount += (data.redeemAmount) ? data.redeemAmount : 0;
    totalStt += (data.redeemStt) ? data.redeemStt : 0;
    purchaseAmount += (data.amount) ? data.amount : 0;
    totalStGain += (data.stGain) ? data.stGain : 0;
    totalLtGain += (data.ltGain) ? data.ltGain : 0;
    totalStLoss += (data.stLoss) ? data.stLoss : 0;
    totalLtLoss += (data.ltLoss) ? data.ltLoss : 0;
    totalIndexGain += (data.indexGain) ? data.indexGain : 0;
    totalIndexLoss += (data.indexLoss) ? data.indexLoss : 0;
     
    let obj = {
      totalAmt:'Total',
      totalAmount :totalAmount,
      totalStt: totalStt,
      purchaseAmount:purchaseAmount,
      totalStGain  :totalStGain,
      totalLtGain :totalLtGain,
      totalStLoss  :totalStLoss,
      totalLtLoss  :totalLtLoss,
      totalIndexGain :totalIndexGain,
      totalIndexLoss :totalIndexLoss
    };
    return obj;
  }
  getFinalTotalValue(data) {

    this.total_stGain += (data) ? data.totalStGain : 0;
    this.total_ltGain += (data) ? data.totalLtGain : 0;
    this.total_stLoss += (data) ? data.totalStLoss : 0;
    this.total_ltLoss += (data) ? data.totalLtLoss : 0;
    this.total_indexGain += (data) ? data.totalIndexGain : 0;
    this.total_indexLoss += (data) ? data.totalIndexLoss : 0;
    this.purchaseAmount += (data) ? data.purchaseAmount : 0;
    this.redeemAmount += (data) ? data.totalAmount : 0;
    this.total_stt +=(data) ? data.totalStt : 0;
  }
  getDividendSummaryData(data) {
    if(data){
      let filterObj = []
      this.totalReinvesment = 0;
      let mutualFund = this.MfServiceService.filter(data, 'mutualFund');
      mutualFund.forEach(element => {
        if(element.redemptionTransactions){
          element.redemptionTransactions.forEach(ele => {
            // let financialyear = this.MfServiceService.getYearFromDate(ele.transactionDate)
            let trnDate = new Date(ele.transactionDate)
            if(trnDate >= this.fromDate && trnDate <= this.toDate){
              if (element.dividendPayout != 0 && element.dividendReinvestment != 0) {
                element.totalReinvesment = element.dividendPayout + element.dividendReinvestment
                this.totalReinvesment += ((element.totalReinvesment) ? element.totalReinvesment : 0);
                this.totaldividendPayout += ((element.dividendPayout) ? element.dividendPayout : 0);
                this.totaldividendReinvestment += ((element.dividendReinvestment) ? element.dividendReinvestment : 0);
                filterObj.push(element);
              }
            }
          });
        } else{
          filterObj = [];
        }
      });
      return filterObj;
    }
    
  }
  isGroup = (index, item) => item.schemeName;// for grouping schme name


}
