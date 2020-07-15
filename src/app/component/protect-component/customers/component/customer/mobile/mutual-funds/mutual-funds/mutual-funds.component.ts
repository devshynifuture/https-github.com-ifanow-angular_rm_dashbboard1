import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/services/app-constants';
import { Chart } from 'angular-highcharts';
import { MfServiceService } from '../../../accounts/assets/mutual-fund/mf-service.service';
import { LoaderFunction } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-mutual-funds',
  templateUrl: './mutual-funds.component.html',
  styleUrls: ['./mutual-funds.component.scss']
})
export class MutualFundsComponent implements OnInit {
  mutualFund: any;
  totalValue: any;
  backtoMf;
  showmfDetails;
  familyWiseAllocation: any;
  mfSubCategoryPieConfig: Chart;
  mfAllocationPieConfig : Chart;
  mfSubCatAllocationData: any[];
  worker: Worker;
  chartData: any[] = [
    {
      name: 'Equity',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[0],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Fixed income',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[1],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Commodities',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[2],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Real estate',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[3],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Others',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[4],
      dataLabels: {
        enabled: false
      }
    }
  ]
  filterData: any;
  clientId: any;
  clientData: any;
  advisorId: any;
  subCategoryData: any;
  mfDetailsData

  constructor(
    public mfServiceService : MfServiceService,
    public loaderFn: LoaderFunction,
    public customerService : CustomerService,
    public eventService :EventService,

  ) {
    this.clientId = AuthService.getClientId()
    this.advisorId = AuthService.getAdvisorId()
    this.clientData = AuthService.getClientData()
  }
  mfAllocationData: any[] = [
    {
      name: 'EQUITY',
      y: 0,
      color: AppConstants.DONUT_CHART_COLORS[0],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'DEBT',
      y: 0,
      color: AppConstants.DONUT_CHART_COLORS[1],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'HYBRID',
      y: 0,
      color: AppConstants.DONUT_CHART_COLORS[2],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'SOLUTION ORIENTED',
      y: 0,
      color: AppConstants.DONUT_CHART_COLORS[4],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'OTHERS',
      y: 0,
      color: AppConstants.DONUT_CHART_COLORS[3],
      dataLabels: {
        enabled: false
      }
    }
  ]
  tabsLoaded = {
    portfolioData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    rtaFeeds: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    recentTransactions: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    documentsVault: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    riskProfile: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    globalRiskProfile: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    goalsData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
      displaySection: false,
    },
    cashflowData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    customerProfile: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    },
    mfPortfolioSummaryData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
      displaySection: false,
    },
    mfSubCategorySummaryData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
      displaySection: false,
    },
    familyMembers: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    }
  };
  ngOnInit() {
    this.initializePieChart()
    this.getMFPortfolioData();

  }
  getMFPortfolioData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId
    }
    this.tabsLoaded.mfPortfolioSummaryData.isLoading = true
      this.loaderFn.increaseCounter();
      this.customerService.getMutualFund(obj).subscribe(
        data => this.getMutualFundResponse(data), (error) => {
          this.eventService.openSnackBar(error, "DISMISS");
          this.tabsLoaded.mfPortfolioSummaryData.dataLoaded = false;
          this.tabsLoaded.mfPortfolioSummaryData.isLoading = false;
        }
      );
  }
  getMutualFundResponse(data) {
    this.subCategoryData=[]
    this.tabsLoaded.mfPortfolioSummaryData.isLoading = false;
    if (data) {
      this.filterData = this.mfServiceService.doFiltering(data);
      this.mutualFund = this.filterData;
      this.subCategoryData = this.mutualFund.subCategoryData
      console.log('mf data',this.mutualFund)
      this.asyncFilter(this.filterData.mutualFundList, this.filterData.mutualFundCategoryMastersList)

      this.getFamilyMemberWiseAllocation(data); // for FamilyMemberWiseAllocation
    }
  }
  asyncFilter(mutualFund, categoryList) {
    if (typeof Worker !== 'undefined') {
      const input = {
        mutualFundList: mutualFund,
        mutualFund: this.mutualFund,
        type: '',
        // mfService: this.mfService
      };
      // Create a new
      this.worker = new Worker('src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund.worker.ts', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        this.totalValue = data.totalValue;
        this.generateMFallocationChartData(categoryList); // for Calculating MF categories percentage
        this.generateSubCategorywiseChartData(this.mutualFund.subCategoryData);
        this.generateSubCategorywiseAllocationData(this.mutualFund.subCategoryData); // For subCategoryWiseAllocation
        this.mfPieChartDataMgnt(); // pie chart data after calculating percentage
        this.tabsLoaded.mfPortfolioSummaryData.hasData = true;
        this.tabsLoaded.mfPortfolioSummaryData.dataLoaded = true;

      };
      this.worker.postMessage(input);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
  getFamilyMemberWiseAllocation(data) {
    this.familyWiseAllocation = data.family_member_list;
  }
  generateMFallocationChartData(data) {// function for calculating percentage
    // this.mfAllocationData = [];
    let counter = 0;
    data.forEach(element => {
      switch (element.category) {
        case 'DEBT':
          this.mfAllocationData.push({
            name: element.category,
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[1],
            dataLabels: {
              enabled: false
            }
          })
          counter++;
          break;

        case 'EQUITY':
          this.mfAllocationData.push({
            name: element.category,
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[0],
            dataLabels: {
              enabled: false
            }
          })
          counter++;
          break;
        case 'HYBRID':
          this.mfAllocationData.push({
            name: element.category,
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[2],
            dataLabels: {
              enabled: false
            }
          })
          counter++;
          break;
        case 'SOLUTION ORIENTED':
          this.mfAllocationData.push({
            name: element.category,
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[4],
            dataLabels: {
              enabled: false
            }
          })
          counter++;
          break;
        default:
          this.mfAllocationData.push({
            name: 'OTHERS',
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[3],
            dataLabels: {
              enabled: false
            }
          })
          counter++;
          break;
      }
    });
    this.mfAllocationData = [...new Map(this.mfAllocationData.map(item => [item.name, item])).values()];
    this.mfAllocationData.forEach(e => {
      e.name = e.name[0].toUpperCase() + e.name.slice(1).toLowerCase();
    })
  }
  generateSubCategorywiseAllocationData(data) {
    data = data.sort((a, b) =>
      a.currentValue > b.currentValue ? -1 : (a.currentValue === b.currentValue ? 0 : 1)
    );

    console.log(data);
    let counter = 0;
    this.mfSubCatAllocationData = [];
    let othersData = {
      name: 'Others',
      y: 0,
      percentage: 0,
      color: AppConstants.DONUT_CHART_COLORS[4],
      dataLabels: { enabled: false }
    }
    data.forEach((data, ind) => {
      if (ind < 4) {
        this.mfSubCatAllocationData.push({
          name: data.subCategory,
          y: data.currentValue,
          percentage: data.allocatedPercentage,
          color: AppConstants.DONUT_CHART_COLORS[counter],
          dataLabels: {
            enabled: false
          }
        })
        counter++;
      } else {
        othersData.y += data.currentValue
        othersData.percentage += data.allocatedPercentage

      }
    })
    this.mfSubCatAllocationData.push(othersData);

    this.mfSubCategoryPieConfig.removeSeries[0];
    this.mfSubCategoryPieConfig.addSeries({
      type: 'pie',
      name: 'Browser share',
      innerSize: '60%',
      animation: false,
      data: this.mfSubCatAllocationData,
    }, true, false)

  }
  mfPieChartDataMgnt() {
    this.mfAllocationPieConfig.removeSeries(0);
    this.mfAllocationPieConfig.addSeries({
      type: 'pie',
      name: 'Browser share',
      innerSize: '60%',
      data: this.mfAllocationData,
    }, true, false)
  }
  generateSubCategorywiseChartData(data) {
    data = this.mfServiceService.sorting(data, 'currentValue');
    console.log(data);

  }
  initializePieChart() {
    let chartConfig: any = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        animation: false
      },
      title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
      },
      tooltip: {
        pointFormat: ' <b>{point.percentage:.1f}%</b>'
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
          center: ['50%', '50%'],
          size: '100%'
        }
      },
      exporting: {
        enabled: false
      },
      series: [{
        type: 'pie',
        name: 'Asset allocation',
        animation: false,
        innerSize: '60%',
        data: this.chartData
      }]
    }
    //this.assetAllocationPieConfig = new Chart(chartConfig);
    this.mfAllocationPieConfig = new Chart(chartConfig);
    this.mfSubCategoryPieConfig = new Chart(chartConfig);
    chartConfig.series = [{
      type: 'pie',
      animation: false,
      name: 'MF Asset allocation',
      innerSize: '60%',
      data: this.mfAllocationData
    }]
  }
}
