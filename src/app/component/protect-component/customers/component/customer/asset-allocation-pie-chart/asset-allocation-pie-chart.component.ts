import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../customer.service';
import { AppConstants } from 'src/app/services/app-constants';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-asset-allocation-pie-chart',
  templateUrl: './asset-allocation-pie-chart.component.html',
  styleUrls: ['./asset-allocation-pie-chart.component.scss']
})
export class AssetAllocationPieChartComponent implements OnInit {
  assetAllocationPieConfig: Chart;
  tabsLoaded = {
    portfolioData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    }
  };
  chartTotal = 100;
  chartData: any[] = [
    {
      name: 'Equity',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[0],
      dataLabels: {
        enabled: false
      }
    },
    {
      name: 'Debt',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[1],
      dataLabels: {
        enabled: false
      }
    },
     {
      name: 'Fixed income',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[2],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Commodities',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[3],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Real estate',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[4],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'Others',
      y: 20,
      color: AppConstants.DONUT_CHART_COLORS[5],
      dataLabels: {
        enabled: false
      }
    }
  ]
  portFolioData: any[] = [];
  clientData: any;
  advisorId: any;
  hasError: boolean = false;
  constructor(private customerService:CustomerService,private eventService:EventService) { }

  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientData = AuthService.getClientData();
    this.initializePieChart();
    this.loadAssetAlocationData();

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
    this.assetAllocationPieConfig = new Chart(chartConfig);
  }
  loadAssetAlocationData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      targetDate: new Date().getTime()
    }
    this.tabsLoaded.portfolioData.isLoading = true;

    this.customerService.getAssetAllocationSummary(obj).subscribe(res => {
      if (res == null) {
        this.portFolioData = [];
        this.tabsLoaded.portfolioData.hasData = false;
      } else {
        this.tabsLoaded.portfolioData.hasData = true;
        // let stock = res.find(d => d.assetType == 6);
        // this.portFolioData = res;
        // if (stock) {
        //   this.portFolioData = this.portFolioData.filter(d => d.assetType != 6);
        //   this.portFolioData.unshift(stock);
        // }

        let chartData = [];
        let counter = 0;
        let othersData = {
          y: 0,
          name: 'Others',
          color: AppConstants.DONUT_CHART_COLORS[4],
          dataLabels: {
            enabled: false
          }
        }
        let chartTotal = 1;
        let hasNoDataCounter = res.length;
        let pieChartData = res;
        // let pieChartData =  res.filter(element => element.assetType != 2 && element.currentValue != 0);
        pieChartData.forEach(element => {
          if (element.currentValue > 0) {
            chartTotal += element.currentValue;
            if (counter < 6) {
              chartData.push({
                y: element.currentValue,
                name: element.assetTypeString,
                color: AppConstants.DONUT_CHART_COLORS[counter],
                dataLabels: {
                  enabled: false
                }
              })
            } else {
              othersData.y += element.currentValue;
            }
            counter++;
          } else {
            hasNoDataCounter--;
          }
        });
        chartTotal -= 1;
        if (chartTotal === 0) {
          this.tabsLoaded.portfolioData.hasData = false
        }
        // if (counter > 4) {
        //   chartData.push(othersData);
        // }
        if (counter > 0) {
          this.chartTotal = chartTotal;
          this.chartData = chartData;
          this.assetAllocationPieChartDataMgnt(this.chartData);
        }
      }
      this.tabsLoaded.portfolioData.isLoading = false;
      this.tabsLoaded.portfolioData.dataLoaded = true;
    }, err => {
      this.hasError = true;
      this.tabsLoaded.portfolioData.isLoading = false;
      this.eventService.openSnackBar(err, "Dismiss")
    })
  }
  assetAllocationPieChartDataMgnt(data) {
    this.assetAllocationPieConfig.removeSeries(0);
    this.assetAllocationPieConfig.addSeries({
      type: 'pie',
      name: 'Asset allocation',
      animation: false,
      innerSize: '60%',
      data: data,
    }, true, true);
  }
}
