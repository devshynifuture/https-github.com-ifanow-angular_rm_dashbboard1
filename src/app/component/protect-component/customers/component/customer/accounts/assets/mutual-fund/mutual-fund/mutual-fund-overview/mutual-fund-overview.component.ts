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

@Component({
  selector: 'app-mutual-fund-overview',
  templateUrl: './mutual-fund-overview.component.html',
  styleUrls: ['./mutual-fund-overview.component.scss']
})
export class MutualFundOverviewComponent implements OnInit {

  mfData: any;
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
  constructor(public subInjectService: SubscriptionInject, public UtilService: UtilService,
    public eventService: EventService, private custumService: CustomerService, private MfServiceService: MfServiceService) {
  }

  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  displayedColumns1 = ['data', 'amts'];
  datasource1 = [{},{},{}];
  @ViewChild('mfOverviewTemplate', {static: false}) mfOverviewTemplate: ElementRef;

  // @Input() mutualFund;

  ngOnInit() {
    this.getMutualFundData();
    this.dataSource = [{}, {}, {}];
    this.dataSource2 = [{}, {}, {}];
    this.dataSource3 = [{}, {}, {}];
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
    this.mfData = data;
    this.isLoading = false;
    console.log(data);
    this.calculatePercentage(data); // for Calculating MF categories percentage
    this.pieChart('piechartMutualFund'); // pie chart data after calculating percentage
    this.dataSource4 = data.mutualFundCategoryMastersList; // category wise allocation
    this.getCashFlowStatus(); // Used for cashFlow status
    this.getsubCategorywiseAllocation(data); // For subCategoryWiseAllocation
    this.getFamilyMemberWiseAllocation(data); // for FamilyMemberWiseAllocation
    this.schemeWiseAllocation(data); // for shemeWiseAllocation
  }
  calculatePercentage(data) {// function for calculating percentage
    this.categoryList = data.mutualFundCategoryMastersList;
    this.categoryList.forEach(element => {
      if (element.category == 'DEBT') {
        this.debtCurrentValue = element.currentValue;
        this.debtPercentage = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.debtPercentage = parseInt(this.debtPercentage);
      } else if (element.category == 'EQUITY') {
        this.equityCurrentValue = element.currentValue;
        this.equityPercentage = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.equityPercentage = parseInt(this.equityPercentage);
      } else if (element.category == 'HYBRID') {
        this.hybridCurrentValue = element.currentValue;
        this.hybridPercenatge = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.hybridPercenatge = parseInt(this.hybridPercenatge);
      } else if (element.category == 'SOLUTION ORIENTED') {
        this.solution_OrientedCurrentValue = element.currentValue;
        this.solution_OrientedPercenatge = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.solution_OrientedPercenatge = parseInt(this.solution_OrientedPercenatge);
      } else {
        this.otherCurrentValue = element.currentValue;
        this.otherPercentage = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.otherPercentage = parseInt(this.otherPercentage);
      }
    });
  }
  getCashFlowStatus() {
    // Used for cashFlow status
    this.datasource1=[
      { data: 'a. Investment', amts: this.mfData.total_amount_inv },
      { data: 'b. Switch In', amts: this.mfData.total_switch_in },
      { data: 'c. Switch Out', amts: this.mfData.total_switch_out },
      { data: 'd. Redemption', amts: this.mfData.total_redemption },
      { data: 'e. Dividend Payout', amts: this.mfData.total_dividend_payout },
      { data: 'f. Net Investment (a+b-c-d-e)', amts: this.mfData.total_net_investment },
      { data: 'g. Market Value', amts: this.mfData.total_market_value },
      { data: 'h. Net Gain (g-f)', amts: this.mfData.total_unrealized_gain },
      { data: 'i. Realized XIRR (All Transactions)', amts: this.mfData.total_xirr },
    
    ];
  }
  getsubCategorywiseAllocation(data) {
    this.filteredArray = this.MfServiceService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.isLoading = true
    if(this.dataSource3.length > 0){
      this.dataSource3 = new MatTableDataSource(this.filteredArray);
      this.isLoading = false
    }
  }
  getFamilyMemberWiseAllocation(data) {
    this.isLoading = true
    if(this.dataSource.length > 0){
      this.dataSource = new MatTableDataSource(data.family_member_list);
      this.isLoading = false
    }
  }
  schemeWiseAllocation(data) {
    this.isLoading = true
    this.filteredArray = this.MfServiceService.filter(this.filteredArray, 'mutualFundSchemeMaster');
    if(this.dataSource2.length > 0){
      this.dataSource2 = new MatTableDataSource(this.filteredArray);
      this.isLoading = false
    }
  }
  generatePdf() {
    let para = document.getElementById('template');
    this.UtilService.htmlToPdf(para.innerHTML, 'Test')
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
  openUpperFragment(data) {
    const fragmentData = {
      flag: 'app-upper-customer',
      id: 1,
      data,
      direction: 'top',
      componentName: UpperCustomerComponent,
      state: 'open'
    };
    const subscription = this.eventService.changeUpperSliderState(fragmentData).subscribe(
      upperSliderData => {
        if (UtilService.isDialogClose(upperSliderData)) {
          // this.getClientSubscriptionList();
          subscription.unsubscribe();
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

