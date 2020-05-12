import { Component, OnInit, ViewChild, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { ExcelService } from '../../../../../excel.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ReconciliationService } from 'src/app/component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { MfServiceService } from '../../mf-service.service';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { Key } from 'protractor';

@Component({
  selector: 'app-mutual-funds-capital',
  templateUrl: './mutual-funds-capital.component.html',
  styleUrls: ['./mutual-funds-capital.component.scss']
})
export class MutualFundsCapitalComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  displayedColumns: string[] = ['schemeName', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  // dataSource = ;
  dataSource = new MatTableDataSource([{}, {}, {}]);
  displayedColumns1: string[] = ['schemeName1', 'folioNumber', 'investorName', 'stGain', 'stLoss', 'ltGain', 'indexedGain', 'liloss', 'indexedLoss'];
  // dataSource1 = ELEMENT_DATA1;
  dataSource1 = new MatTableDataSource([{}, {}, {}]);
  displayedColumns2: string[] = ['schemeName2', 'folioNumber', 'dividendPayoutAmount', 'dividendReInvestmentAmount', 'totalReinvestmentAmount'];
  // dataSource2 = ELEMENT_DATA2;
  dataSource2 = new MatTableDataSource([{}, {}, {}]);
  excelData: any[];
  footer = [];
  stGain: number;
  indexedGain: number;
  parentId: any;
  advisorId: any;
  clientId: any;
  adminAdvisorIds: any[] = [];
  categoryData: any[] = [];
  mfList: any[];
  mutualFundTransactions: any[];
  purchaseTransaction: any[];
  redemptiontransaction: any[];
  isLoading: Boolean;
  @Input() mutualFund;
  @Output() changeInput = new EventEmitter();
  purchaseAgainstRedemption: any[];
  total_stGain = 0;
  total_ltGain = 0;
  total_stLoss = 0;
  total_ltLoss = 0;
  total_indexGain = 0;
  total_indexLoss = 0;
  totalReinvesment = 0;
  totaldividendReinvestment = 0;
  totaldividendPayout = 0;
  summaryView = true;
  debtObj: any;
  equityObj: any;
  rightFilterData: any;
  fromDateYear:any;
  toDateYear:any;
  grandFatheringEffect: boolean;
  objSendToDetailedCapital:any;
  redemption: any[];
  mutualFundList: any[];
  dataToSend: { mfListData: any; grandfatheringEffect: any; fromDateYear: any; toDateYear: any; };
  capitalGainData: any;
  // capitalGainData: any;
  constructor(private pdfGen:PdfGenService,private excel: ExcelGenService,private UtilService: UtilService, private custumService: CustomerService, private eventService: EventService, private reconService: ReconciliationService, private MfServiceService: MfServiceService, private subInjectService: SubscriptionInject) { }
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('tableEl2', { static: false }) tableEl2;
  @ViewChild('tableEl3', { static: false }) tableEl3;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getUserInfo().parentId
    this.fromDateYear = 2019;
    this.toDateYear = 2020 ;
    this.grandFatheringEffect = true;
    // this.getAdvisorData();
    this.getCapitalgain();
    this.summaryView =true
    // this.calculateCapitalGain(this.capitalGainData)

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

            // this.customDataSource = new MatTableDataSource([{}, {}, {}]);
            //  this.isLoading = true;
            // this.changeInput.emit(true);
            this.rightFilterData = sideBarData.data;
            this.dataSource = new MatTableDataSource([{}, {}, {}]);
            this.dataSource1 = new MatTableDataSource([{}, {}, {}]);
            this.dataSource2 = new MatTableDataSource([{}, {}, {}]);
            this.isLoading = true;
            // this.changeInput.emit(true);
            this.dataToSend = {
              mfListData : this.rightFilterData.capitalGainData.responseData,
              grandfatheringEffect : this.rightFilterData.grandfathering,
              fromDateYear : (this.rightFilterData.financialYear.length >0) ? this.rightFilterData.financialYear[0].from : 2019,
              toDateYear : (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020
            }
            if(this.rightFilterData.reportFormat[0].name == 'Detailed'){
              this.summaryView = false
            }else{
              this.summaryView = true;
              this.calculateCapitalGain(this.rightFilterData.capitalGainData.responseData);
            }
            
            // this.asyncFilter(this.rightFilterData.mutualFundList);
            // this.getListForPdf(this.rightFilterData.transactionView);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }
  // getAdvisorData(){
  //   this.isLoading = true;
  //   this.reconService.getTeamMemberListValues({ advisorId: this.advisorId })
  //   .subscribe(data => {
  //     if (data && data.length !== 0) {
  //       data.forEach(element => {
  //         this.adminAdvisorIds.push(element.adminAdvisorId);
  //       });
  //       this.getCapitalgain();
  //     } else {
  //       this.adminAdvisorIds = [this.advisorId];
  //     }
  //   });

  // }
  getCapitalgain() {
    this.isLoading = true;
    this.changeInput.emit(true);
    const obj = {
      advisorIds: [this.advisorId],
      clientId: this.clientId,
      parentId: 0

    };
    this.custumService.capitalGainGet(obj).subscribe(
      data => {
        this.capitalGainData = data;
        // this.mutualFundList = this.MfServiceService.filter(this.capitalGainData, 'mutualFund');
        // this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
         this.calculateCapitalGain( this.capitalGainData)
      },(error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  calculateCapitalGain(data){
    this.isLoading = false;
    let equityData;
    this.changeInput.emit(false);
    if (data) {
      this.mutualFundList = this.MfServiceService.filter(this.capitalGainData, 'mutualFund');
       this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
      this.categoryData = data;
      let catObj = this.MfServiceService.categoryFilter(this.categoryData, 'category');
      Object.keys(catObj).map(key => {
        if(catObj[key] != 'DEBT'){
          equityData = this.filterCategoryWise(catObj[key], key);
        }
      });
      let debtData = this.filterCategoryWise(catObj['DEBT'], 'DEBT');
      // let equityData = this.filterCategoryWise(catObj['EQUITY'], 'EQUITY');
      this.dataSource = new MatTableDataSource(equityData);
      this.dataSource1 = new MatTableDataSource(debtData);
      let dividenedSummaryData = this.getDividendSummaryData(this.categoryData);
      this.dataSource2 = new MatTableDataSource(dividenedSummaryData);
      this.objSendToDetailedCapital={
        mfData:this.mutualFund,
        responseData :this.capitalGainData ,
        debtData : debtData,
        equityData : equityData,
        dividenedSummaryData :dividenedSummaryData,
        grandFatheringEffect:this.grandFatheringEffect,
        redemptionList:this.redemption,
        mutualFundList:this.mutualFundList,
        fromDateYear:this.fromDateYear,
        toDateYear:this.toDateYear,
      }
    } else {
      this.dataSource.data = [];
      this.dataSource1.data = [];
      this.dataSource2.data = [];
    }
  }
  getDividendSummaryData(data) {
    if(data){
      let filterObj = []
      this.totalReinvesment = 0;
      let mutualFund = this.MfServiceService.filter(data, 'mutualFund');
      mutualFund.forEach(element => {
        if(element.redemptionTransactions){
          element.redemptionTransactions.forEach(ele => {
            let financialyear = this.MfServiceService.getYearFromDate(ele.transactionDate)
            if(financialyear >= this.fromDateYear && financialyear<= this.toDateYear){
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
  filterCategoryWise(data, category) {
    if(data){
      let finalValue ={};
      this.mfList = this.MfServiceService.filter(data, 'mutualFund');
      this.mfList.forEach(element => {
        if(element.redemptionTransactions){
          element.redemptionTransactions.forEach(ele => {
            let financialyear = this.MfServiceService.getYearFromDate(ele.transactionDate)
             if(financialyear >= this.fromDateYear && financialyear<= this.toDateYear){
               if (ele.purchaceAgainstRedemptionTransactions) {
                 let totalValue = this.getCalculatedValues(ele.purchaceAgainstRedemptionTransactions, category);
                 finalValue = this.MfServiceService.addTwoObjectValues(totalValue, finalValue, {totalAmt: true});
                 // this.getFinalTotalValue(totalValue);
                 element.stGain = totalValue.stGain;
                 element.ltGain = totalValue.ltGain;
                 element.stLoss = totalValue.stLoss;
                 element.ltLoss = totalValue.ltLoss;
                 element.indexGain = totalValue.indexGain;
                 element.indexLoss = totalValue.indexLoss;
               } else {
                 ele.purchaceAgainstRedemptionTransactions = []
               }
             }
           });
        }else{
          this.mfList = [];
        }
      });
      (category == 'DEBT') ? this.debtObj =finalValue : this.equityObj =finalValue;
      finalValue={};
      return this.mfList;
    }
  }
  getCalculatedValues(data, category) {
    let days;
    let gainLossBasedOnGrandfathering;
    (category == 'DEBT') ? days = 1095 : days = 365;
    (this.grandFatheringEffect) ? gainLossBasedOnGrandfathering = 'grandFatheringGainOrLossAmount' : gainLossBasedOnGrandfathering ='gainOrLossAmount' ;
    let stGain = 0;
    let ltGain = 0;
    let stLoss = 0;
    let ltLoss = 0;
    let indexGain = 0;
    let indexLoss = 0;

    data.forEach(element => {
      if (element.days < days) {
        stGain += ((element[gainLossBasedOnGrandfathering] >= 0) ? (element[gainLossBasedOnGrandfathering]) : 0)
        stLoss += ((element[gainLossBasedOnGrandfathering] < 0) ? (element[gainLossBasedOnGrandfathering]) : 0)
      } else {
        ltGain += ((element[gainLossBasedOnGrandfathering] >= 0) ? element[gainLossBasedOnGrandfathering] : 0);
        ltLoss += ((element[gainLossBasedOnGrandfathering] < 0) ? element[gainLossBasedOnGrandfathering] : 0);
      }
      indexGain += ((element.indexGainOrLoss >= 0) ? (element.indexGainOrLoss) : 0)
      indexLoss += ((element.indexGainOrLoss < 0) ? (element.indexGainOrLoss) : 0)
    });
    let obj = {
      stGain: stGain,
      ltGain: stLoss,
      stLoss: ltGain,
      ltLoss: ltLoss,
      indexGain: indexGain,
      indexLoss: indexLoss
    };
    return obj;
  }
  getFinalTotalValue(data) {

    this.total_stGain += (data.stGain) ? data.stGain : 0;
    this.total_ltGain += (data.ltGain) ? data.ltGain : 0;
    this.total_stLoss += (data.stLoss) ? data.stLoss : 0;
    this.total_ltLoss += (data.ltLoss) ? data.ltLoss : 0;
    this.total_indexGain += (data.indexGain) ? data.indexGain : 0;
    this.total_indexLoss += (data.indexLoss) ? data.indexLoss : 0;
  }
  ExportTOExcel(data) {
    console.log(data);
  }
  outputResponse(data){
    this.isLoading =false;
    this.changeInput.emit(false);
    this.fromDateYear = data.fromDateYear;
    this.toDateYear = data.toDateYear;
    this.grandFatheringEffect = data.grandfatheringEffect
    if(data.summaryView == true){
      this.summaryView = true;
      this.calculateCapitalGain(data.data);
    }else{
      this.summaryView = false
    }


    // (data.grandfathering == 1) ? this.grandFatheringEffect = true : this.grandFatheringEffect = false;
    // this.objSendToDetailedCapital.responseData=data.capitalGainData.responseData;
    // this.objSendToDetailedCapital.grandFatheringEffect=data.grandfathering;
    // this.objSendToDetailedCapital.fromDateYear = data.financialYear[0].from;
    // this.objSendToDetailedCapital.toDateYear =data.financialYear[0].to;
    // this.getCapitalgainRes(data.capitalGainData.responseData);
  }
  Excel(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
       let rows2 = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
    let rows3 = this.tableEl._elementRef.nativeElement.rows;
    this.excel.generateExcel(rows, tableTitle)
  }
  pdf(tableTitle) {
    let rows = this.tableEl._elementRef.nativeElement.rows;
    this.pdfGen.generatePdf(rows, tableTitle);
  }
} 
