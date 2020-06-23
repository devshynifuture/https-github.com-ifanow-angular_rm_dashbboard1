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
import { ActivatedRoute } from '@angular/router';

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
  mutualFund;
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
  fromDateYear: any;
  toDateYear: any;
  grandFatheringEffect: boolean;
  objSendToDetailedCapital: any;
  redemption: any[];
  mutualFundList: any[];
  dataToSend: any;
  capitalGainData: any;
  toDate: Date;
  fromDate: Date;
  finalValue={};
  GTReinvesment=0;
  GTdividendPayout=0;
  GTdividendReinvestment=0;
  fragmentData = { isSpinner: false };
  setCapitaSummary: any;
  bulkData: any;
  // capitalGainData: any;
  constructor(private pdfGen: PdfGenService,
    public routerActive: ActivatedRoute,
     private excel: ExcelGenService, private UtilService: UtilService, private custumService: CustomerService, private eventService: EventService, private reconService: ReconciliationService, private MfServiceService: MfServiceService, private subInjectService: SubscriptionInject) { 
       

    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        let param1 = queryParamMap['params'];
        this.clientId = parseInt(param1.clientId)
        this.advisorId = parseInt(param1.advisorId)
        console.log('2423425', param1)
      }
      else {
        this.advisorId = AuthService.getAdvisorId();
        this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
      }
    });
  }
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('tableEl2', { static: false }) tableEl2;
  @ViewChild('tableEl3', { static: false }) tableEl3;
  uploadData(data) {
    if (data) {
      this.bulkData = data
      this.clientId = data.clientId
      this.ngOnInit()
    }
    return this.setCapitaSummary

  }
  ngOnInit() {
    if (localStorage.getItem('token') != 'authTokenInLoginComponnennt') {
      localStorage.setItem('token', 'authTokenInLoginComponnennt')
    }

    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        let param1 = queryParamMap['params'];
        this.clientId = parseInt(param1.clientId)
        this.advisorId = parseInt(param1.advisorId)
        this.fromDateYear = (param1.from);
        this.toDateYear = (param1.to);
        console.log('2423425', param1)
      }
    });
    this.setCapitaSummary = {}
    this.setCapitaSummary.dataSource = []
    this.setCapitaSummary.dataSource1 = []
    this.setCapitaSummary.dataSource2 = []
    this.setCapitaSummary.equityObj = {}
    this.setCapitaSummary.debtObj = {}
    this.setCapitaSummary.GTdividendReinvestment = {}
    this.setCapitaSummary.GTdividendPayout = {}
    this.setCapitaSummary.GTReinvesment = {}

    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getUserInfo().parentId
    this.MfServiceService.getMfData()
      .subscribe(res => {
        this.mutualFund = res;
      })
    if(this.bulkData){
      this.fromDateYear = this.bulkData.from;
      this.toDateYear = this.bulkData.to;
    }else{
      this.fromDateYear = 2019;
      this.toDateYear = 2020;
    }
    this.fromDate = new Date(this.fromDateYear, 3, 1);
    this.toDate = new Date(this.toDateYear, 2, 31);
    this.grandFatheringEffect = true;
    // this.getAdvisorData();
    this.getCapitalgain();
    this.summaryView = true
    // this.calculateCapitalGain(this.capitalGainData)

  }
  openFilter() {
    // this.MfServiceService.getCapitalGainFilter(this.objSendToDetailedCapital,this.rightFilterData)
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
      capitalGainData: this.objSendToDetailedCapital,
      filterDataForCapital: (this.rightFilterData) ? this.rightFilterData : null
      // reportFormat:reportFormat
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
              mfListData: this.rightFilterData.capitalGainData.responseData,
              grandfatheringEffect: this.rightFilterData.grandfathering,
              fromDateYear: (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].from : 2019,
              toDateYear: (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020,
              filterDataForCapital: this.rightFilterData
            };
            (this.rightFilterData.grandfathering == 1) ? this.grandFatheringEffect = true : this.grandFatheringEffect = false;
            this.fromDateYear = (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].from : 2019;
            this.fromDate = new Date(this.fromDateYear, 3, 1);
            this.toDateYear = (this.rightFilterData.financialYear.length > 0) ? this.rightFilterData.financialYear[0].to : 2020;
            this.toDate = new Date(this.toDateYear, 2, 31);
            if (this.rightFilterData.reportFormat[0].name == 'Detailed') {
              this.summaryView = false
            } else {
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
        if (data) {
          this.capitalGainData = data;
          this.mutualFundList = this.MfServiceService.filter(this.capitalGainData, 'mutualFund');
          this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
          this.calculateCapitalGain(this.capitalGainData)
        } else {
          this.dataSource.data = [];
          this.dataSource1.data = [];
          this.dataSource2.data = [];
          this.changeInput.emit(false);
        }

      }, (error) => {
        this.dataSource.data = [];
        this.dataSource1.data = [];
        this.dataSource2.data = [];
        this.changeInput.emit(false);
        this.eventService.showErrorMessage(error);
      }
    );
  }
  generatePdf() {
    this.fragmentData.isSpinner = true
    const para = document.getElementById('template');
    this.UtilService.htmlToPdf(para.innerHTML, 'capitalGain', 'true', this.fragmentData, '', '');
  }
  calculateCapitalGain(data) {
    this.isLoading = false;
    let equityData = [];
    this.changeInput.emit(false);
    if (data) {
      this.mutualFundList = this.MfServiceService.filter(this.capitalGainData, 'mutualFund');
      this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
      this.categoryData = data;
      let catObj = this.MfServiceService.categoryFilter(this.categoryData, 'category');
      Object.keys(catObj).map(key => {
        if (catObj[key][0].category != 'DEBT') {
          let tempData = this.filterCategoryWise(catObj[key], 'EQUITY');
          equityData.push(...tempData)
        }
      });
      let debtData = this.filterCategoryWise(catObj['DEBT'], 'DEBT');
      // let equityData = this.filterCategoryWise(catObj['EQUITY'], 'EQUITY');
      this.dataSource = new MatTableDataSource(equityData);
      this.dataSource1 = new MatTableDataSource(debtData);
      let dividenedSummaryData = this.getDividendSummaryData(this.categoryData);
      this.dataSource2 = new MatTableDataSource(dividenedSummaryData);
      console.log('ahgfjsf', this.dataSource)
      console.log('2414w', this.dataSource1)
      this.setCapitaSummary = {}
      this.setCapitaSummary.dataSource = this.dataSource
      this.setCapitaSummary.dataSource1 = this.dataSource1
      this.setCapitaSummary.dataSource2 = this.dataSource2
      this.setCapitaSummary.equityObj = this.equityObj
      this.setCapitaSummary.debtObj = this.debtObj
      this.setCapitaSummary.GTdividendReinvestment = this.GTdividendReinvestment
      this.setCapitaSummary.GTdividendPayout = this.GTdividendPayout
      this.setCapitaSummary.GTReinvesment = this.GTReinvesment

      this.MfServiceService.setCapitalSummary(this.setCapitaSummary)
      this.objSendToDetailedCapital = {
        mfData: this.mutualFund,
        responseData: this.capitalGainData,
        debtData: debtData,
        equityData: equityData,
        dividenedSummaryData: dividenedSummaryData,
        grandFatheringEffect: this.grandFatheringEffect,
        redemptionList: this.redemption,
        mutualFundList: this.mutualFundList,
        fromDateYear: this.fromDateYear,
        toDateYear: this.toDateYear,
      }
    } else {
      this.dataSource.data = [];
      this.dataSource1.data = [];
      this.dataSource2.data = [];
      this.changeInput.emit(false);

    }
  }
  getDividendSummaryData(data) {
    if (data) {
      let filterObj = []
      this.totalReinvesment = 0;
      let flag = false;
      let mutualFund = this.MfServiceService.filter(data, 'mutualFund');
      if (this.rightFilterData) {
        mutualFund = this.MfServiceService.filterArray(mutualFund, 'familyMemberId', this.rightFilterData.family_member_list, 'id');
      }
      mutualFund.forEach(element => {
        if (element.dividendTransactions) {
          element.dividendTransactions.forEach(ele => {
            let trnDate = new Date(ele.transactionDate)
            if (trnDate >= this.fromDate && trnDate <= this.toDate) {
              if (ele.fwTransactionType == 'Dividend Payout') {
                ele.dividendPayout = ele.amount
              } else {
                ele.dividendReinvestment = ele.amount
              }
              if (ele.dividendPayout != 0 || ele.dividendReinvestment != 0) {
                ele.totalReinvesment = ((ele.dividendPayout ? ele.dividendPayout : 0) + (ele.dividendReinvestment ? ele.dividendReinvestment : 0))
                this.totalReinvesment += ((ele.totalReinvesment) ? ele.totalReinvesment : 0);
                this.totaldividendPayout += ((ele.dividendPayout) ? ele.dividendPayout : 0);
                this.totaldividendReinvestment += ((ele.dividendReinvestment) ? ele.dividendReinvestment : 0);

              }
              flag = true;

            }

          });
          if (flag) {
            const obj = {
              schemeName: element.schemeName,
              folioNumber: element.folioNumber,
              dividendPayout: this.totaldividendPayout,
              dividendReinvestment: this.totaldividendReinvestment,
              totalReinvesment: this.totalReinvesment
            }
            filterObj.push(obj);
            this.GTReinvesment += (this.totalReinvesment) ? this.totalReinvesment : 0;
            this.GTdividendPayout += (this.totaldividendPayout) ? this.totaldividendPayout : 0;
            this.GTdividendReinvestment += (this.totaldividendReinvestment) ? this.totaldividendReinvestment : 0;
            this.totalReinvesment = 0;
            this.totaldividendPayout = 0;
            this.totaldividendReinvestment = 0;
          }

        }
      });
      return filterObj;
    }
  }
  filterCategoryWise(data, category) {
    if (data) {
      this.GTReinvesment = 0;
      this.GTdividendPayout = 0;
      this.GTdividendReinvestment = 0;
      this.finalValue;
      let fiterArray = [];
      this.mfList = this.MfServiceService.filter(data, 'mutualFund');
      if (this.rightFilterData) {
        this.mfList = this.MfServiceService.filterArray(this.mfList, 'familyMemberId', this.rightFilterData.family_member_list, 'id');
      }
      this.mfList.forEach(element => {
        if (element.redemptionTransactions) {
          element.redemptionTransactions.forEach(ele => {
            // let financialyear = this.MfServiceService.getYearFromDate(ele.transactionDate)
            let trnDate = new Date(ele.transactionDate)
            if (trnDate >= this.fromDate && trnDate <= this.toDate) {
              if (ele.purchaceAgainstRedemptionTransactions || (ele.purchaceAgainstRedemptionTransactions) ? ele.purchaceAgainstRedemptionTransactions.length > 0 : ele.purchaceAgainstRedemptionTransactions) {
                let totalValue = this.getCalculatedValues(ele.purchaceAgainstRedemptionTransactions, category);

                // this.getFinalTotalValue(totalValue);
                // element.stGain = totalValue.stGain;
                // element.ltGain = totalValue.ltGain;
                // element.stLoss = totalValue.stLoss;
                // element.ltLoss = totalValue.ltLoss;
                // element.indexGain = totalValue.indexGain;
                // element.indexLoss = totalValue.indexLoss;
                ele.stGain = totalValue.stGain;
                ele.ltGain = totalValue.ltGain;
                ele.stLoss = totalValue.stLoss;
                ele.ltLoss = totalValue.ltLoss;
                ele.indexGain = totalValue.indexGain;
                ele.indexLoss = totalValue.indexLoss;
                ele.schemeName = element.schemeName;
                ele.folioNumber = element.folioNumber;
                ele.ownerName = element.ownerName;
                // fiterArray.push(element);
                fiterArray.push(ele);

                let filterr = {
                  indexGain: totalValue.indexGain,
                  indexLoss: totalValue.indexLoss,
                  ltGain: totalValue.ltGain,
                  ltLoss: totalValue.ltLoss,
                  stGain: totalValue.stGain,
                  stLoss: totalValue.stLoss
                }
                this.finalValue = this.MfServiceService.addTwoObjectValues(filterr, this.finalValue, { totalAmt: true });
              } else {
                ele.purchaceAgainstRedemptionTransactions = []
              }
            }
          });
        } else {
          element.redemptionTransactions = [];
        }
      });
      if (Object.keys(this.finalValue).length != 0) {
        (category == 'DEBT') ? this.debtObj = this.finalValue : this.equityObj = this.finalValue;
        this.finalValue = {};
      }
      // if(category!='EQUITY'){
      //   this.finalValue = {};
      // }
      return fiterArray;
    }
  }
  getCalculatedValues(data, category) {
    let days;
    let gainLossBasedOnGrandfathering;
    (category == 'DEBT') ? days = 1095 : days = 365;
    (this.grandFatheringEffect) ? gainLossBasedOnGrandfathering = 'grandFatheringGainOrLossAmount' : gainLossBasedOnGrandfathering = 'gainOrLossAmount';
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
      ltGain: ltGain,
      stLoss: stLoss,
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
  outputResponse(data) {
    this.isLoading = false;
    this.changeInput.emit(false);
    this.fromDateYear = data.fromDateYear;
    this.fromDate = new Date(this.fromDateYear, 3, 1);
    this.toDateYear = data.toDateYear;
    this.toDate = new Date(this.toDateYear, 2, 31);
    this.grandFatheringEffect = data.grandfatheringEffect
    this.rightFilterData = data.filterDataForCapital
    if (data.summaryView == true) {
      this.summaryView = true;
      this.calculateCapitalGain(data.data);
    } else {
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
    this.fragmentData.isSpinner = true;

    let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
    this.UtilService.htmlToPdf(para.innerHTML, 'CapitalGain', 'true', this.fragmentData, '', '');
    // let rows = this.tableEl._elementRef.nativeElement.rows;
    // this.pdfGen.generatePdf(rows, tableTitle);
  }
} 
