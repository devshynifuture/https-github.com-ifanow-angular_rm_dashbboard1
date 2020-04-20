import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { UpperCustomerComponent } from 'src/app/component/protect-component/customers/component/common-component/upper-customer/upper-customer.component';
import { AddMutualFundComponent } from '../add-mutual-fund/add-mutual-fund.component';
import { MFSchemeLevelHoldingsComponent } from '../mfscheme-level-holdings/mfscheme-level-holdings.component';
import { MFSchemeLevelTransactionsComponent } from '../mfscheme-level-transactions/mfscheme-level-transactions.component';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import { CustomerService } from '../../../../../customer.service';
import { MatTableDataSource } from '@angular/material';
import { MfServiceService } from '../../mf-service.service';
import { RightFilterComponent } from 'src/app/component/protect-component/customers/component/common-component/right-filter/right-filter.component';
import { WebworkerService } from 'src/app/services/web-worker.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';

@Component({
  selector: 'app-mutual-fund-overview',
  templateUrl: './mutual-fund-overview.component.html',
  styleUrls: ['./mutual-fund-overview.component.scss']
})
export class MutualFundOverviewComponent implements OnInit {
  mfData: any = {};
  equityPercentage: any;
  debtPercentage: any;
  hybridPercenatge: any;
  solution_OrientedPercenatge: any;
  otherPercentage: any;
  categoryList: any;
  debtCurrentValue: any;
  equityCurrentValue: any;
  hybridCurrentValue: any;
  solution_OrientedCurrentValue: any;
  otherCurrentValue: any;
  dataSource4: Array<any> = [{}, {}, {}];
  filteredArray: any[];
  subCategoryArray: any;
  dataSource2;
  dataSource;
  isLoading: boolean = false;
  dataSource3;
  rightFilterData: any;
  showHideTable: any;
  showSummaryBar = true;
  showSchemeWise = true;
  showCashFlow = true;
  showFamilyMember = true;
  showCategory = true;
  showSubCategory = true;
  totalValue: any = {};
  fragmentData = {isSpinner : false};
  advisorId: any;
  advisorData:any;
  constructor(public subInjectService: SubscriptionInject, public UtilService: UtilService,
    public eventService: EventService, private custumService: CustomerService, private MfServiceService: MfServiceService, private workerService: WebworkerService,private settingService : SettingsService) {
  }

  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  displayedColumns1 = ['data', 'amts'];
  datasource1 = [{}, {}, {}];
  @ViewChild('mfOverviewTemplate', { static: false }) mfOverviewTemplate: ElementRef;

  @Input() mutualFund;

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.getMutualFundData();
    this.dataSource = [{}, {}, {}];
    this.dataSource2 = [{}, {}, {}];
    this.dataSource3 = [{}, {}, {}];
    this.getPersonalDetails(this.advisorId);
  }
  getPersonalDetails(data){
    const obj={
      id:data
    }
    this.settingService.getPersonalProfile(obj).subscribe(
      data => {
        console.log(data);
      }
    );
    this.settingService.getProfileDetails(obj).subscribe(
      data => {
        console.log(data);
        this.advisorData = data;
      }
    );
  }
  asyncFilter(mutualFund, categoryList) {
    if (typeof Worker !== 'undefined') {
      console.log(`13091830918239182390183091830912830918310938109381093809328`);
      const input = {
        mutualFundList: mutualFund,
        type: '',
        // mfService: this.mfService
      };
      // Create a new
      const worker = new Worker('../../mutual-fund.worker.ts', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.totalValue = data.totalValue;
        this.calculatePercentage(categoryList); // for Calculating MF categories percentage
        this.pieChart('piechartMutualFund'); // pie chart data after calculating percentage
        this.getCashFlowStatus();
        this.isLoading = false;

        console.log(`MUTUALFUNDSummary COMPONENT page got message:`, data);
      };
      worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  getMutualFundData() {
    this.isLoading = true

    const obj = {
      advisorId: 2753,
      clientId: 15545
    };
    this.custumService.getMutualFund(obj).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMutualFundResponse(data) {
    let filterData = this.MfServiceService.doFiltering(data);
    this.asyncFilter(filterData.mutualFundList, filterData.mutualFundCategoryMastersList)
    this.mfData = data;
    console.log(data);
    this.dataSource4 = data.mutualFundCategoryMastersList; // category wise allocation
    this.getsubCategorywiseAllocation(data); // For subCategoryWiseAllocation
    this.getFamilyMemberWiseAllocation(data); // for FamilyMemberWiseAllocation
    this.schemeWiseAllocation(data); // for shemeWiseAllocation
    this.isLoading = false;


  }
  calculatePercentage(data) {// function for calculating percentage
    this.debtCurrentValue = 0;
    this.equityCurrentValue = 0;
    this.hybridCurrentValue = 0;
    this.solution_OrientedCurrentValue = 0;
    this.otherCurrentValue = 0;
    this.debtPercentage = 0;
    this.equityPercentage = 0;
    this.hybridPercenatge = 0;
    this.solution_OrientedPercenatge = 0;
    this.otherPercentage = 0;
    data.forEach(element => {
      if (element.category == 'DEBT') {
        this.debtCurrentValue = element.currentValue;
        this.debtPercentage = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.debtPercentage = parseFloat(this.debtPercentage);
      } else if (element.category == 'EQUITY') {
        this.equityCurrentValue = element.currentValue;
        this.equityPercentage = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.equityPercentage = parseFloat(this.equityPercentage);
      } else if (element.category == 'HYBRID') {
        this.hybridCurrentValue = element.currentValue;
        this.hybridPercenatge = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.hybridPercenatge = parseFloat(this.hybridPercenatge);
      } else if (element.category == 'SOLUTION ORIENTED') {
        this.solution_OrientedCurrentValue = element.currentValue;
        this.solution_OrientedPercenatge = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.solution_OrientedPercenatge = parseFloat(this.solution_OrientedPercenatge);
      } else {
        this.otherCurrentValue = element.currentValue;
        this.otherPercentage = ((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2);
        this.otherPercentage = parseFloat(this.otherPercentage);
      }
    });
  }
  getCashFlowStatus() {
    // Used for cashFlow status
    this.datasource1 = [
      { data: 'a. Investment', amts: (this.totalValue.totalTransactionAmt) ? this.totalValue.totalTransactionAmt : 0 },
      { data: 'b. Switch In', amts: (this.totalValue.switchIn) ? this.totalValue.switchIn : 0 },
      { data: 'c. Switch Out', amts: (this.totalValue.withdrawals) ? this.totalValue.withdrawals : 0 },
      { data: 'd. Redemption', amts: (this.totalValue.redemption) ? this.totalValue.redemption : 0 },
      { data: 'e. Dividend Payout', amts: (this.totalValue.dividendPayout) ? this.totalValue.dividendPayout : 0 },
      { data: 'f. Net Investment (a+b-c-d-e)', amts: (this.totalValue.netInvestment) ? this.totalValue.netInvestment : 0 },
      { data: 'g. Market Value', amts: (this.totalValue.marketValue) ? this.totalValue.marketValue : 0 },
      { data: 'h. Net Gain (g-f)', amts: (this.totalValue.netGain) ? this.totalValue.netGain : 0 },
      { data: 'i. Realized XIRR (All Transactions)', amts: (this.totalValue.xirr) ? this.totalValue.xirr : 0 },

    ];
  }
  getsubCategorywiseAllocation(data) {
    this.isLoading = true
    this.filteredArray = this.MfServiceService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    if (this.dataSource3.length > 0) {
      this.dataSource3 = new MatTableDataSource(this.filteredArray);
      this.isLoading = false
    }
  }
  getFamilyMemberWiseAllocation(data) {
    this.isLoading = true
    if (this.dataSource.length > 0) {
      this.dataSource = new MatTableDataSource(data.family_member_list);
      this.isLoading = false
    }
  }
  schemeWiseAllocation(data) {
    this.isLoading = true
    this.filteredArray = this.MfServiceService.filter(this.filteredArray, 'mutualFundSchemeMaster');
    if (this.dataSource2.length > 0) {
      this.dataSource2 = new MatTableDataSource(this.filteredArray);
      this.isLoading = false
    }
  }

  generatePdf() {
    this.fragmentData.isSpinner = true;
    let para = document.getElementById('template');
    this.UtilService.htmlToPdf(para.innerHTML,'Test',this.fragmentData)
  }
  pieChart(id) {
    Highcharts.chart('piechartMutualFund', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: 0,
          endAngle: 360,
          center: ['52%', '55%'],
          size: '120%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        data: [
          {
            name: 'Equity',
            // y:20,
            y: (this.equityPercentage) ? this.equityPercentage : 0,
            color: '#008FFF',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Debt',
            // y:20,
            y: (this.debtPercentage) ? this.debtPercentage : 0,
            color: '#5DC644',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Hybrid',
            // y:20,
            y: (this.hybridPercenatge) ? this.hybridPercenatge : 0,
            color: '#FFC100',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            // y:20,
            y: (this.otherPercentage) ? this.otherPercentage : 0,
            color: '#A0AEB4',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            // y:20,
            y: (this.solution_OrientedPercenatge) ? this.solution_OrientedPercenatge : 0,
            color: '#FF7272',
            dataLabels: {
              enabled: false
            }
          }
        ]
      }]
    });
  }
  openMutualFund(flag, data) {
    let component;
    switch (true) {
      case (flag == 'addPortfolio'):
        component = AddMutualFundComponent;
        break;
      case (flag == 'holding'):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent;
    }
    const fragmentData = {
      flag: 'editMF',
      data,
      id: 1,
      state: 'open',
      componentName: component
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          rightSideDataSub.unsubscribe();

        }
      }
    );
  }
  // openUpperFragment(data) {
  //   const fragmentData = {
  //     flag: 'app-upper-customer',
  //     id: 1,
  //     data,
  //     direction: 'top',
  //     componentName: UpperCustomerComponent,
  //     state: 'open'
  //   };
  //   const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
  //     upperSliderData => {
  //       if (UtilService.isDialogClose(upperSliderData)) {
  //         // this.getClientSubscriptionList();
  //         subscription.unsubscribe();
  //       }
  //     }
  //   );
  // }
  openFilter() {
    const fragmentData = {
      flag: 'openFilter',
      data: {},
      id: 1,
      state: 'open35',
      componentName: RightFilterComponent
    };
    fragmentData.data = {
      name: 'Overview Report',
      mfData: this.mutualFund,
      folioWise: this.mutualFund.mutualFundList,
      schemeWise: this.mutualFund.schemeWise,
      familyMember: this.mutualFund.family_member_list,
      category: this.mutualFund.mutualFundCategoryMastersList,
      transactionView: this.displayedColumns,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          console.log('this is sidebardata in subs subs 2: ', sideBarData);
          if (sideBarData.data != 'Close') {
            this.totalValue = {};
            this.dataSource2.data = [{}, {}, {}]
            this.dataSource4 = [{}, {}, {}]
            this.dataSource.data = [{}, {}, {}]
            this.dataSource3.data = [{}, {}, {}]
            this.isLoading = true;
            this.rightFilterData = sideBarData.data;
            this.asyncFilter(this.rightFilterData.mutualFundList, this.rightFilterData.category);
            this.dataSource2.data = this.rightFilterData.schemeWise;
            this.dataSource4 = this.rightFilterData.category;
            this.dataSource.data = this.rightFilterData.family_member_list;
            this.dataSource3.data = this.rightFilterData.subCategoryData;
            this.showHideTable = this.rightFilterData.overviewFilter;
            (this.showHideTable[0].name == 'Summary bar' && this.showHideTable[0].selected == true) ? this.showSummaryBar = true : (this.showSummaryBar = false);
            (this.showHideTable[1].name == 'Scheme wise allocation' && this.showHideTable[1].selected == true) ? this.showSchemeWise = true : (this.showSchemeWise = false);
            (this.showHideTable[2].name == 'Cashflow Status' && this.showHideTable[2].selected == true) ? this.showCashFlow = true : (this.showCashFlow = false);
            (this.showHideTable[3].name == 'Family Member wise allocation' && this.showHideTable[3].selected == true) ? this.showFamilyMember = true : (this.showFamilyMember = false);
            (this.showHideTable[4].name == 'Category wise allocation' && this.showHideTable[4].selected == true) ? this.showCategory = true : (this.showCategory = false);
            (this.showHideTable[5].name == 'Sub Category wise allocation' && this.showHideTable[5].selected == true) ? this.showSubCategory = true : (this.showSubCategory = false);


            this.isLoading = false;
            // this.getMutualFundResponse(this.rightFilterData.mfData);
            // this.asyncFilter(this.rightFilterData.mutualFundList);
            // this.getListForPdf(this.rightFilterData.transactionView);
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }


  Excel(something) {

  }
}
export interface PeriodicElement1 {
  data: string;
  amts: string;
}

