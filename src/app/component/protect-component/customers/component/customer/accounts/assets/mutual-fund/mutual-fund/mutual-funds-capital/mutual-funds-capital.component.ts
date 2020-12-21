import { Component, EventEmitter, OnInit, Output, ViewChild, ViewChildren, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { FormatNumberDirective } from 'src/app/format-number.directive';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ReconciliationService } from 'src/app/component/protect-component/AdviserComponent/backOffice/backoffice-aum-reconciliation/reconciliation/reconciliation.service';
import { MfServiceService } from '../../mf-service.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { ExcelGenService } from 'src/app/services/excel-gen.service';
import { PdfGenService } from 'src/app/services/pdf-gen.service';
import { RightFilterDuplicateComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter-duplicate/right-filter-duplicate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BackOfficeService } from 'src/app/component/protect-component/AdviserComponent/backOffice/back-office.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mutual-funds-capital',
  templateUrl: './mutual-funds-capital.component.html',
  styleUrls: ['./mutual-funds-capital.component.scss']
})
export class MutualFundsCapitalComponent implements OnInit {
  details;
  reportDate;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChildren(FormatNumberDirective) formatNumber;
  @Output() loaded = new EventEmitter();
  @Input() finPlanObj: any;//finacial plan pdf input
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
  adminAdvisorIds: any;
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
  finalValue = {};
  GTReinvesment = 0;
  GTdividendPayout = 0;
  GTdividendReinvestment = 0;
  fragmentData = { isSpinner: false };
  setCapitaSummary: any;
  bulkData: any;
  userInfo: any;
  clientDetails: any;
  clientData: any;
  getOrgData: any;
  familyMemberId: number;
  familyList = [];
  mfBulkEmailRequestId: number;
  criteriaDate: Date;
  loadingDone: boolean = false;
  // capitalGainData: any;
  constructor(private cd: ChangeDetectorRef, private pdfGen: PdfGenService,
    public routerActive: ActivatedRoute,
    private datePipe: DatePipe,
    private route: Router,
    private backOfficeService: BackOfficeService,
    private excel: ExcelGenService, private UtilService: UtilService, private custumService: CustomerService, private eventService: EventService, private reconService: ReconciliationService, private MfServiceService: MfServiceService, private subInjectService: SubscriptionInject) {


    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        let param1 = queryParamMap['params'];
        this.clientId = parseInt(param1.clientId)
        this.advisorId = parseInt(param1.advisorId)
        this.parentId = parseInt(param1.parentId);
        console.log('2423425', param1)
      } else {
        this.advisorId = AuthService.getAdvisorId();
        // this.parentId = AuthService.getUserInfo().parentId
        this.userInfo = AuthService.getUserInfo();
        this.clientData = AuthService.getClientData();
        this.getOrgData = AuthService.getOrgDetails();
        this.parentId = AuthService.getParentId();

        this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
      }
    });
  }
  @ViewChild('tableEl', { static: false }) tableEl;
  @ViewChild('tableEl2', { static: false }) tableEl2;
  @ViewChild('tableEl3', { static: false }) tableEl3;
  @ViewChild('mfCapitalTemplate', { static: false }) mfCapitalTemplate: ElementRef;
  @ViewChild('mfCapitalTemplateHeader', { static: false }) mfCapitalTemplateHeader;
  uploadData(data) {
    if (data) {
      this.bulkData = data
      this.clientId = data.clientId
      this.ngOnInit()
    }
    return this.setCapitaSummary

  }
  ngOnInit() {
    this.MfServiceService.getadvisorList()
      .subscribe(res => {
        this.adminAdvisorIds = res;
      });
    if (localStorage.getItem('token') != 'authTokenInLoginComponnennt') {
      localStorage.setItem('token', 'authTokenInLoginComponnennt')
    }

    this.routerActive.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has('clientId')) {
        let param1 = queryParamMap['params'];
        this.clientId = parseInt(param1.clientId)
        this.advisorId = parseInt(param1.advisorId)
        this.familyMemberId = parseInt(param1.familyMemberId);
        this.mfBulkEmailRequestId = parseInt(param1.mfBulkEmailRequestId)
        this.familyList = []
        const obj = {
          id: this.familyMemberId
        }
        this.familyList.push(obj)
        this.fromDateYear = (param1.from);
        this.toDateYear = (param1.to);
        console.log('2423425', param1)
        this.getDetails()
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
    this.MfServiceService.getMfData()
      .subscribe(res => {
        this.mutualFund = res;
      })
    if (this.bulkData) {
      this.fromDateYear = this.bulkData.from;
      this.toDateYear = this.bulkData.to;
    } else {
      this.fromDateYear = 2019;
      this.toDateYear = 2020;
    }
    this.fromDate = new Date(this.fromDateYear, 3, 1);
    this.toDate = new Date(this.toDateYear, 2, 31);
    this.grandFatheringEffect = true;
    // this.getAdvisorData();
    if (this.adminAdvisorIds.length > 0) {
      this.getCapitalgain();
    } else {
      this.teamMemberListGet();
    }
    this.summaryView = true
    // this.calculateCapitalGain(this.capitalGainData)

  }
  teamMemberListGet() {
    this.adminAdvisorIds = [];
    this.custumService.getSubAdvisorListValues({ advisorId: this.advisorId })
      .subscribe(data => {
        if (data && data.length !== 0) {
          console.log('team members: ', data);
          data.forEach(element => {
            this.adminAdvisorIds.push(element);
          });
          const isIncludeID = this.adminAdvisorIds.includes(this.advisorId);
          if (!isIncludeID) {
            this.adminAdvisorIds.unshift(this.advisorId);
          }
          console.log(this.adminAdvisorIds);
        } else {
          this.adminAdvisorIds = [this.advisorId];
        }
        this.getCapitalgain();
        this.MfServiceService.setadvisorList(this.adminAdvisorIds);
      }, err => {
        this.adminAdvisorIds = [this.advisorId];
        this.MfServiceService.setadvisorList(this.adminAdvisorIds);
        this.getCapitalgain();

      });
  }
  openFilter() {
    // this.MfServiceService.getCapitalGainFilter(this.objSendToDetailedCapital,this.rightFilterData)
    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterDuplicateComponent
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
      parentId: this.parentId ? this.parentId : this.advisorId,
      advisorIds: this.advisorId,
      clientId: this.clientId,

    };
    this.custumService.capitalGainGet(obj).subscribe(
      data => {
        if (data) {
          const myArray = data
          const list = [];
          this.capitalGainData = [];
          myArray.forEach(val => list.push(Object.assign({}, val)));
          this.capitalGainData = list;
          this.mutualFundList = this.MfServiceService.filter(this.capitalGainData, 'mutualFund');
          this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
          // this.calculateCapitalGain(this.capitalGainData)
          this.calculateCapitalGain(data)
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
    // let header = null
    const header = document.getElementById('templateHeader');
    this.UtilService.htmlToPdf(header.innerHTML, para.innerHTML, 'capitalGain', 'true', this.fragmentData, '', '', true);
  }
  calculateCapitalGain(data) {
    this.isLoading = false;
    let equityData = [];
    this.changeInput.emit(false);
    if (data) {
      const myArray = data
      const list = [];
      this.capitalGainData = [];
      myArray.forEach(val => list.push(Object.assign({}, val)));
      this.capitalGainData = list;
      this.mutualFundList = this.MfServiceService.filter(data, 'mutualFund');
      // this.mutualFundList = this.MfServiceService.filter(this.capitalGainData, 'mutualFund');
      this.redemption = this.MfServiceService.filter(this.mutualFundList, 'redemptionTransactions');
      this.categoryData = data;
      let catObj = this.MfServiceService.categoryFilter(this.categoryData, 'category');
      this.categorisedHybridFund(catObj);
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
      console.log('dataSource', this.dataSource);
      console.log('dataSource1', this.dataSource1);
      console.log('dataSource2', this.dataSource2);
      this.setCapitaSummary.dataSource = this.dataSource
      this.setCapitaSummary.dataSource1 = this.dataSource1
      this.setCapitaSummary.dataSource2 = this.dataSource2
      this.setCapitaSummary.equityObj = this.equityObj
      this.setCapitaSummary.debtObj = this.debtObj
      this.setCapitaSummary.GTdividendReinvestment = this.GTdividendReinvestment
      this.setCapitaSummary.GTdividendPayout = this.GTdividendPayout
      this.setCapitaSummary.GTReinvesment = this.GTReinvesment;
      this.cd.detectChanges();
      this.loaded.emit(this.mfCapitalTemplate.nativeElement);
      this.MfServiceService.setCapitalSummary(this.setCapitaSummary)
      if (this.route.url.split('?')[0] == '/pdf/capitalGainSummary') {
        this.generatePdfBulk()
      }
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
  categorisedHybridFund(data) {
    let equityFund = [];
    let debtFund = [];
    Object.keys(data).map(key => {
      if (data[key][0].category == 'HYBRID') {
        data[key][0].mutualFund.forEach(element => {
          if (element.subCategoryName == 'Hybrid - Aggressive' || element.subCategoryName == 'Hybrid - Aggressive (CE)' || element.subCategoryName == 'Hybrid - Equity Savings'
            || element.subCategoryName == 'Hybrid - Dyn Asset Allo or Bal Adv' || element.subCategoryName == 'Hybrid - Arbitrage' || element.subCategoryName == 'Hybrid - Balanced') {
            equityFund.push(element);
          } else if (element.subCategoryName == 'Hybrid - Conservative Hybrid Fund' || element.subCategoryName == 'Hybrid - Conservative' || element.subCategoryName == 'Hybrid - Conservative (CE)' || element.subCategoryName == 'Hybrid - Multi Asset Allocation') {
            debtFund.push(element);
          } else {
            equityFund.push(element);
          }
        });
      }
    });
    if (debtFund.length > 0) {
      if (data['DEBT']) {
        data['DEBT'][0].mutualFund = [...data['DEBT'][0].mutualFund, ...debtFund];
      } else {
        data.DEBT[0].mutualFund = debtFund
      }
    }
    if (equityFund.length > 0) {
      if (data['EQUITY']) {
        data['EQUITY'][0].mutualFund = [...data['EQUITY'][0].mutualFund, ...equityFund]
      } else {
        data.EQUITY[0].mutualFund = equityFund

      }
    }
    delete data['HYBRID'];
    return data;
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
      if (this.familyList.length > 0) {
        mutualFund = this.MfServiceService.filterArray(this.mfList, 'familyMemberId', this.familyList, 'id');
      }
      mutualFund = this.MfServiceService.sorting(mutualFund, 'schemeName');
      mutualFund.forEach(element => {
        if (element.dividendTransactions) {
          element.dividendTransactions.forEach(ele => {
            let trnDate = new Date(ele.transactionDate)
            trnDate.setHours(0,0,0,0);
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
              isin: element.isin,
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
      let redeemArray = [];
      let filterr;
      this.GTReinvesment = 0;
      this.GTdividendPayout = 0;
      this.GTdividendReinvestment = 0;
      this.finalValue;
      let fiterArray = [];
      this.mfList = this.MfServiceService.filter(data, 'mutualFund');
      if (this.rightFilterData) {
        this.mfList = this.MfServiceService.filterArray(this.mfList, 'familyMemberId', this.rightFilterData.family_member_list, 'id');
      }
      if (this.familyList.length > 0) {
        this.mfList = this.MfServiceService.filterArray(this.mfList, 'familyMemberId', this.familyList, 'id');
      }
      this.mfList = this.MfServiceService.sorting(this.mfList, 'schemeName');
      this.mfList = this.MfServiceService.casFolioNumber(this.mfList);
      this.mfList.forEach(element => {
        if (element.redemptionTransactions) {
          if (element.redemptionTransactions.length == 1) {
            element.redemptionTransactions.forEach(ele => {
              // let financialyear = this.MfServiceService.getYearFromDate(ele.transactionDate)
              let trnDate = new Date(ele.transactionDate);
              trnDate.setHours(0,0,0,0);
              if (trnDate >= this.fromDate && trnDate <= this.toDate) {
                if (ele.purchaceAgainstRedemptionTransactions || (ele.purchaceAgainstRedemptionTransactions) ? ele.purchaceAgainstRedemptionTransactions.length > 0 : ele.purchaceAgainstRedemptionTransactions) {
                  this.criteriaDate = new Date(2018, 0, 31); // this date is used for criteria if the transactions happens before this date then only grandfathering effect is applied otherwise data remain as it is
                  let totalValue = this.getCalculatedValues(ele.purchaceAgainstRedemptionTransactions, category);
                  ele.stGain = totalValue.stGain;
                  ele.ltGain = totalValue.ltGain;
                  ele.stLoss = totalValue.stLoss;
                  ele.ltLoss = totalValue.ltLoss;
                  ele.indexGain = totalValue.indexGain;
                  ele.indexLoss = totalValue.indexLoss;
                  ele.schemeName = element.schemeName;
                  ele.folioNumber = element.folioNumber;
                  ele.ownerName = element.ownerName;
                  ele.isin = element.isin;
                  // fiterArray.push(element);
                  fiterArray.push(ele);

                  filterr = {
                    indexGain: totalValue.indexGain,
                    indexLoss: totalValue.indexLoss,
                    ltGain: totalValue.ltGain,
                    ltLoss: totalValue.ltLoss,
                    stGain: totalValue.stGain,
                    stLoss: totalValue.stLoss
                  }
                  if (filterr) {
                    this.finalValue = this.MfServiceService.addTwoObjectValues(filterr, this.finalValue, { totalAmt: true });
                  }
                } else {
                  ele.purchaceAgainstRedemptionTransactions = []
                }
              }
            });
          } else {
            redeemArray=[];
            element.redemptionTransactions.forEach(ele => {
              let trnDate = new Date(ele.transactionDate)
              trnDate.setHours(0,0,0,0);
              if (trnDate >= this.fromDate && trnDate <= this.toDate) {
                if (ele.purchaceAgainstRedemptionTransactions || (ele.purchaceAgainstRedemptionTransactions) ? ele.purchaceAgainstRedemptionTransactions.length > 0 : ele.purchaceAgainstRedemptionTransactions) {
                  this.criteriaDate = new Date(2018, 0, 31); // this date is used for criteria if the transactions happens before this date then only grandfathering effect is applied otherwise data remain as it is
                  redeemArray.push(ele.purchaceAgainstRedemptionTransactions);
                } else {
                  ele.purchaceAgainstRedemptionTransactions = []
                }
              }
            });
            if(redeemArray.length > 0){
              redeemArray = redeemArray.flat();
              let totalValue = this.getCalculatedValues(redeemArray, category);
              let array = [{
                stGain: totalValue.stGain, ltGain: totalValue.ltGain, stLoss: totalValue.stLoss,
                ltLoss: totalValue.ltLoss, indexGain: totalValue.indexGain, indexLoss: totalValue.indexLoss,
                schemeName: element.schemeName, folioNumber: element.folioNumber, ownerName: element.ownerName,
                isin: element.isin
              }]
              fiterArray.push({
                stGain: totalValue.stGain, ltGain: totalValue.ltGain, stLoss: totalValue.stLoss,
                ltLoss: totalValue.ltLoss, indexGain: totalValue.indexGain, indexLoss: totalValue.indexLoss,
                schemeName: element.schemeName, folioNumber: element.folioNumber, ownerName: element.ownerName,
                isin: element.isin
              });
              filterr = {
                indexGain: totalValue.indexGain,
                indexLoss: totalValue.indexLoss,
                ltGain: totalValue.ltGain,
                ltLoss: totalValue.ltLoss,
                stGain: totalValue.stGain,
                stLoss: totalValue.stLoss
              }
              if (filterr) {
                this.finalValue = this.MfServiceService.addTwoObjectValues(filterr, this.finalValue, { totalAmt: true });
              }
            }
          }

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
      let purchaseTrnDate = new Date(element.transactionDate)
      if (category == 'EQUITY' && this.criteriaDate >= purchaseTrnDate) {
        gainLossBasedOnGrandfathering = 'grandFatheringGainOrLossAmount'
      } else {
        gainLossBasedOnGrandfathering = 'gainOrLossAmount'
      }
      if (element.days < days) {
        stGain += ((element[gainLossBasedOnGrandfathering] >= 0) ? (element[gainLossBasedOnGrandfathering]) : 0)
        stLoss += ((element[gainLossBasedOnGrandfathering] < 0) ? (element[gainLossBasedOnGrandfathering]) : 0)
      } else {
        ltGain += ((element[gainLossBasedOnGrandfathering] >= 0) ? element[gainLossBasedOnGrandfathering] : 0);
        ltLoss += ((element[gainLossBasedOnGrandfathering] < 0) ? element[gainLossBasedOnGrandfathering] : 0);
      }
      if (ltGain || ltLoss) {
        indexGain = ((data.indexGainOrLoss >= 0) ? (data.indexGainOrLoss) : 0)
        indexLoss = ((data.indexGainOrLoss < 0) ? (data.indexGainOrLoss) : 0)
      }
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
    // let rows = this.tableEl._elementRef.nativeElement.rows;
    // this.excel.generateExcel(rows, tableTitle)
    // let rows2 = this.tableEl._elementRef.nativeElement.rows;
    // this.excel.generateExcel(rows, tableTitle)
    // let rows3 = this.tableEl._elementRef.nativeElement.rows;
    // this.excel.generateExcel(rows, tableTitle)
    setTimeout(() => {
      var blob = new Blob([document.getElementById('template').innerHTML], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
      });
      saveAs(blob, tableTitle + ".xls");
    }, 200);
  }
  pdf(tableTitle) {
    this.fragmentData.isSpinner = true;

    let para = document.getElementById('template');
    // this.util.htmlToPdf(para.innerHTML, 'Test', this.fragmentData);
    this.UtilService.htmlToPdf('', para.innerHTML, 'MF capital gain summary', 'true', this.fragmentData, '', '', true);
    // let rows = this.tableEl._elementRef.nativeElement.rows;
    // this.pdfGen.generatePdf(rows, tableTitle);
  }
  generatePdfBulk() {
    this.loadingDone = true
    const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    setTimeout(() => {

      let para = this.mfCapitalTemplate.nativeElement.innerHTML
      const header = this.mfCapitalTemplateHeader.nativeElement.innerHTML
      // let header = null
      let obj = {
        htmlInput: para,
        name: (this.clientData.name) ? this.clientData.name : '' + 's' + 'MF capital gain summary' + date,
        landscape: true,
        header: header.innerHTML,
        key: 'showPieChart',
        clientId: this.clientId,
        advisorId: this.advisorId,
        fromEmail: this.clientDetails.advisorData.email,
        toEmail: this.clientData.email,

      }
      this.UtilService.bulkHtmlToPdf(obj)
      // this.UtilService.htmlToPdf(para, 'MF_Capital_Gain_Summary', true, this.fragmentData, '', '')
    }, 200);


  }
  getDetails() {
    const obj = {
      clientId: this.clientId,
      advisorId: this.advisorId,
    };
    this.backOfficeService.getDetailsClientAdvisor(obj).subscribe(
      data => this.getDetailsClientAdvisorRes(data)
    );
  }
  getDetailsClientAdvisorRes(data) {
    console.log('data', data)
    this.clientDetails = data
    this.clientData = data.clientData
    this.getOrgData = data.advisorData
    this.userInfo = data.advisorData
  }
}
