import { Component, OnInit, ViewChild, ViewChildren, Input } from '@angular/core';
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

  constructor(private UtilService: UtilService, private custumService: CustomerService, private eventService: EventService, private reconService: ReconciliationService, private MfServiceService: MfServiceService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.stGain = 875.32;
    this.indexedGain = 125.4,
      this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.parentId = AuthService.getUserInfo().parentId
    // this.getAdvisorData();
    this.getCapitalgain();

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
      transactionView: this.displayedColumns
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data && sideBarData.data != 'Close') {
            // this.customDataSource = new MatTableDataSource([{}, {}, {}]);
            // this.isLoading = true;
            // this.changeInput.emit(true);
            // this.rightFilterData = sideBarData.data;
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
    const obj = {
      advisorIds: [2929],
      clientId: 15545,
      parentId: 0

    };
    this.custumService.capitalGainGet(obj).subscribe(
      data => this.getCapitalgainRes(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getCapitalgainRes(data) {
    this.isLoading = false;
    console.log(data);
    if (data) {
      this.categoryData = data;
      let catObj = this.MfServiceService.categoryFilter(this.categoryData, 'category');
      let debtData = this.filterCategoryWise(catObj['DEBT'], 'DEBT');
      let equityData = this.filterCategoryWise(catObj['EQUITY'], 'EQUITY');
      this.dataSource = new MatTableDataSource(debtData);
      this.dataSource1 = new MatTableDataSource(equityData);
      let dividenedSummaryData = this.getDividendSummaryData(this.categoryData);
      this.dataSource2 = new MatTableDataSource(dividenedSummaryData);
    } else {
      this.dataSource.data = [];
      this.dataSource1.data = [];
      this.dataSource2.data = [];
    }

  }
  getDividendSummaryData(data) {
    let filterObj = []
    this.totalReinvesment = 0;
    let mutualFund = this.MfServiceService.filter(data, 'mutualFund');
    mutualFund.forEach(element => {
      if (element.dividendPayout != 0 && element.dividendReinvestment != 0) {
        element.totalReinvesment = element.dividendPayout + element.dividendReinvestment
        this.totalReinvesment += ((element.totalReinvesment) ? element.totalReinvesment : 0);
        this.totaldividendPayout += ((element.dividendPayout) ? element.dividendPayout : 0);
        this.totaldividendReinvestment += ((element.dividendReinvestment) ? element.dividendReinvestment : 0);
        filterObj.push(element);
      }
    });
    return filterObj;
  }
  filterCategoryWise(data, category) {
    this.mfList = this.MfServiceService.filter(data, 'mutualFund');
    this.mfList.forEach(element => {
      element.redemptionTransactions.forEach(ele => {
        if (ele.purchaceAgainstRedemptionTransactions) {
          let totalValue = this.getCalculatedValues(ele.purchaceAgainstRedemptionTransactions, category);
          this.getFinalTotalValue(totalValue);
          element.stGain = totalValue.stGain;
          element.ltGain = totalValue.ltGain;
          element.stLoss = totalValue.stLoss;
          element.ltLoss = totalValue.ltLoss;
          element.indexGain = totalValue.indexGain;
          element.indexLoss = totalValue.indexLoss;
        } else {
          ele.purchaceAgainstRedemptionTransactions = []
        }
      });


    });
    return this.mfList;
  }
  getCalculatedValues(data, category) {
    let days;
    (category == 'DEBT') ? days = 1095 : days = 365;
    let stGain = 0;
    let ltGain = 0;
    let stLoss = 0;
    let ltLoss = 0;
    let indexGain = 0;
    let indexLoss = 0;

    data.forEach(element => {
      if (element.days < days) {
        stGain += ((element.gainOrLossAmount >= 0) ? (element.gainOrLossAmount) : 0)
        stLoss += ((element.gainOrLossAmount < 0) ? (element.gainOrLossAmount) : 0)
      } else {
        ltGain += ((element.gainOrLossAmount >= 0) ? element.gainOrLossAmount : 0);
        ltLoss += ((element.gainOrLossAmount < 0) ? element.gainOrLossAmount : 0);
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
    this.total_ltGain += (data.ltGain) ? data.currentValue : 0;
    this.total_stLoss += (data.stLoss) ? data.stLoss : 0;
    this.total_ltLoss += (data.ltLoss) ? data.absoluteReturn : 0;
    this.total_indexGain += (data.indexGain) ? data.indexGain : 0;
    this.total_indexLoss += (data.indexLoss) ? data.indexLoss : 0;
  }
  ExportTOExcel(data) {
    console.log(data);
  }
}

export interface PeriodicElement {
  schemeName: string;
  folioNumber: string;
  investorName: string;
  stGain: number;
  stLoss: number;
  ltGain: number;
  indexedGain: number;
  liloss: number;
  indexedLoss: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName: 'Agreements & invoices', folioNumber: '15093075', investorName: 'Mitesh Galani', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
  { schemeName: 'Total', folioNumber: '', investorName: '', stGain: 875.32, stLoss: 875.32, ltGain: 0, indexedGain: 123.67, liloss: 123.67, indexedLoss: 24.87 },
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