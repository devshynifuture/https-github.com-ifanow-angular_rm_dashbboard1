import { Component, OnInit, Input } from '@angular/core';
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
// const HighchartsMore = require('highcharts/highcharts-more.src');
// HighchartsMore(Highcharts);

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
  dataSource4: any;
  dataSource3: any;
  filteredArray: any[];
  subCategoryArray: any;
  dataSource2: MatTableDataSource<any>;
  constructor(public subInjectService: SubscriptionInject, public UtilService: UtilService,
    public eventService: EventService, private custumService: CustomerService) {
  }

  displayedColumns = ['name', 'amt', 'value', 'abs', 'xirr', 'alloc'];
  dataSource = ELEMENT_DATA;

  displayedColumns1 = ['data', 'amts'];
  datasource1 = ELEMENT_DATA1;
  // @Input() mutualFund;

  ngOnInit() {
    this.getMutualFundData();

  }


  getMutualFundData() {
    const obj = {
      advisorId: 3967,
      clientId: 2982
    }
    this.custumService.getMutualFund(obj).subscribe(
      data => this.getMutualFundResponse(data), (error) => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  getMutualFundResponse(data) {
    console.log(data)
    this.mfData = data;
    this.calculatePercentage(data);//for Calculating MF categories percentage
    this.pieChart('piechartMutualFund');//pie chart data after calculating percentage
    this.dataSource4 = data.mutualFundCategoryMastersList;//category wise allocation
    this.getCashFlowStatus();//Used for cashFlow status
    this.getsubCategorywiseAllocation(data);//For subCategoryWiseAllocation
    this.getFamilyMemberWiseAllocation(data)//for FamilyMemberWiseAllocation
    this.schemeWiseAllocation(data);//for shemeWiseAllocation
  }
  //function for calculating percentage
  calculatePercentage(data) {
    this.categoryList = data.mutualFundCategoryMastersList;
    this.categoryList.forEach(element => {
      if (element.category == 'DEBT') {
        this.debtCurrentValue = element.currentValue;
        this.debtPercentage = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.debtPercentage = parseInt(this.debtPercentage)
      } else if (element.category == 'EQUITY') {
        this.equityCurrentValue = element.currentValue;
        this.equityPercentage = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.equityPercentage = parseInt(this.equityPercentage)
      } else if (element.category == 'HYBRID') {
        this.hybridCurrentValue = element.currentValue;
        this.hybridPercenatge = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.hybridPercenatge = parseInt(this.hybridPercenatge)
      } else if (element.category == 'SOLUTION ORIENTED') {
        this.solution_OrientedCurrentValue = element.currentValue;
        this.solution_OrientedPercenatge = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.solution_OrientedPercenatge = parseInt(this.solution_OrientedPercenatge)
      } else {
        this.otherCurrentValue = element.currentValue;
        this.otherPercentage = ((element.currentValue / data.total_current_value) * 100).toFixed(2);
        this.otherPercentage = parseInt(this.otherPercentage)
      }
    });
  }
  getCashFlowStatus() {
    //Used for cashFlow status
    this.datasource1.forEach(element => {
      switch (element.data) {
        case ('a. Investment'):
          element.amts = this.mfData.total_amount_inv
          break;
        case ('b. Switch In'):
          element.amts = this.mfData.total_switch_in
          break;
        case ('c. Switch Out'):
          element.amts = this.mfData.total_switch_out
          break;
        case ('d. Redemption'):
          element.amts = this.mfData.total_redemption
          break;
        case ('e. Dividend Payout'):
          element.amts = this.mfData.total_dividend_payout
          break;
        case ('f. Net Investment (a+b-c-d-e)'):
          element.amts = this.mfData.total_net_investment
          break;
        case ('g. Market Value'):
          element.amts = this.mfData.total_market_value
          break;
        case ('h. Net Gain (g-f)'):
          element.amts = this.mfData.total_market_value
          break;
        case ('i. Realized XIRR (All Transactions)'):
          element.amts = this.mfData.total_xirr
          break;
        default:
          return;
      }

    });
  }
  getsubCategorywiseAllocation(data) {
    this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    this.dataSource3 = new MatTableDataSource(this.filteredArray);
    console.log(this.dataSource3);
  }
  getFamilyMemberWiseAllocation(data) {
    let dataToShow = data.family_member_map;
    let familyMemberAllocation = [];
    //   Object.keys(dataToShow).map(function(key){
    //     familyMemberAllocation.push({[key]:dataToShow[key]})
    //     return familyMemberAllocation;
    // });
    // familyMemberAllocation = Object.entries(dataToShow);

    console.log(familyMemberAllocation);
    // familyMemberAllocation.push(data.family_member_map);
    // this.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');

  }
  schemeWiseAllocation(data) {
    this.filter(this.filteredArray, 'mutualFundSchemeMaster');
    this.dataSource2 = new MatTableDataSource(this.filteredArray);
  }
  //Used for filtering the data 
  filter(data, key) {
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
    console.log(finalDataSource)
    this.filteredArray = finalDataSource;//final dataSource Value
  }
  onClick(referenceKeyName) {
    alert(referenceKeyName.id);
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
            color: "#008FFF",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Debt',
            // y:20,
            y: (this.debtPercentage) ? this.debtPercentage : 0,
            color: "#5DC644",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Hybrid',
            // y:20,
            y: (this.hybridPercenatge) ? this.hybridPercenatge : 0,
            color: "#FFC100",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            // y:20,
            y: (this.otherPercentage) ? this.otherPercentage : 0,
            color: "#A0AEB4",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            // y:20,
            y: (this.solution_OrientedPercenatge) ? this.solution_OrientedPercenatge : 0,
            color: "#FF7272",
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
      case (flag == "addPortfolio"):
        component = AddMutualFundComponent;
        break;
      case (flag == "holding"):
        component = MFSchemeLevelHoldingsComponent;
        break;
      default:
        component = MFSchemeLevelTransactionsComponent
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
    /* const fragmentData = {
       flag: 'emailOnly',
       data: clientData,
       id: 1,
       state: 'open'
     };
     const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
       sideBarData => {
         console.log('this is sidebardata in subs subs : ', sideBarData);
         if (UtilService.isDialogClose(sideBarData)) {
           console.log('this is sidebardata in subs subs 2: ',);
           rightSideDataSub.unsubscribe();
         }
       }
     );*/
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

}

export interface PeriodicElement {
  name: string;
  amt: string;
  value: string;
  abs: number;
  xirr: number;
  alloc: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth	',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  { name: 'ICICI Equity Fund Growth	', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
  { name: 'HDFC Top 200', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
  {
    name: 'Aditya Birla Sun Life Frontline Equity Fund-Growth',
    amt: '2,28,580',
    value: '2,28,580',
    abs: 26.99,
    xirr: 8.32,
    alloc: 20.32
  },
  { name: 'Total', amt: '2,28,580', value: '2,28,580', abs: 26.99, xirr: 8.32, alloc: 20.32 },
];

export interface PeriodicElement1 {
  data: string;
  amts: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { data: 'a. Investment', amts: '15,70,000' },
  { data: 'b. Switch In', amts: '2,28,580' },
  { data: 'c. Switch Out', amts: '2,28,580' },
  { data: 'd. Redemption', amts: '0' },
  { data: 'e. Dividend Payout', amts: '0' },
  { data: 'f. Net Investment (a+b-c-d-e)', amts: '2,28,580' },
  { data: 'g. Market Value', amts: '2,28,580' },
  { data: 'h. Net Gain (g-f)', amts: '2,28,580' },
  { data: 'i. Realized XIRR (All Transactions)', amts: '2.81 %' },

];

