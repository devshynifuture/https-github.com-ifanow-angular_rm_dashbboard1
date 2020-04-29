import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/services/app-constants';
import { CustomerService } from '../../../customer.service';
import { LoaderFunction } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-all-feeds',
  templateUrl: './all-feeds.component.html',
  styleUrls: ['./all-feeds.component.scss'],
  providers: [LoaderFunction]
})
export class AllFeedsComponent implements OnInit {
  clientData: any;
  advisorId: any;
  orgDetails:any;
  chart: Chart;

  chartData:any[] = [
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
    }]

  chartTotal = 100;

  constructor(
    private customerService: CustomerService,
    private loaderFn: LoaderFunction,
    private eventService: EventService,
    private authService: AuthService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.orgDetails = authService.orgData;
    this.clientData = AuthService.getClientData();
  }

  tabsLoaded = {
    allFeeds:{
      dataLoaded: false,
      hasData: false,
    },
    portfolio: {
      dataLoaded: false,
      hasData: false,
    },
    plan: {
      dataLoaded: false,
      hasData: false,
    },
    activity: {
      dataLoaded: false,
      hasData: false,
    },
    transactions: {
      dataLoaded: false,
      hasData: false,
    },
    profile: {
      dataLoaded: false,
      hasData: false,
    },
    education: {
      dataLoaded: false,
      hasData: false,
    },
    videos: {
      dataLoaded: false,
      hasData: false,
    },
    riskProfile: {
      dataLoaded: false,
      hasData: false,
    }
  };
  hasError:boolean = false;

  feedsData:any = {};
  portFolioData:any[] = [];
  planData:any = {};
  activityData:any = {};
  transactionsData:any = {};
  profileData:any = {};
  educationData:any = {};
  videosData:any[] = [];
  riskProfileData:any=null;


  ngOnInit() {

    this.chart = new Chart({
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
          center: ['52%', '55%'],
          size: '120%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Asset allocation',
        innerSize: '60%',
        data: this.chartData
      }]
    });

    this.loadAllFeedsPortFolio();
    this.loadFeedsTransactions();
    this.loadDocumentValutData();
    this.loadRiskProfile();
  }


  loadAllFeedsPortFolio(){
    const obj = {
      clientId: this.clientData.id, 
      advisorId: this.advisorId,
      targetDate: new Date().getTime()
    }

    // ?advisorId=2808&clientId=53004&targetDate=1587965868704
    this.loaderFn.increaseCounter();
    this.customerService.getAllFeedsPortFolio(obj).subscribe(res => {
      if(res == null) {
        this.feedsData.portfolioData = null;
      } else {
        this.tabsLoaded.allFeeds.hasData = true;
        this.feedsData.portfolioData = res;

        this.chartData = [];
        let counter = 0;
        let othersData = {
          y: 0,
          name: 'Others',
          color: AppConstants.DONUT_CHART_COLORS[4],
          dataLabels: {
            enabled: false
          }
        }
        this.chartTotal = 1;
        res.forEach(element => {
          this.chartTotal += element.investedAmount;
          if(counter < 4) {
            this.chartData.push({
              y: element.investedAmount,
              name: element.assetTypeString,
              color: AppConstants.DONUT_CHART_COLORS[counter],
              dataLabels: {
                enabled: false
              }
            })
          } else {
            othersData.y += element.investedAmount; 
          }
          counter ++;
        });
        this.chartTotal -=1;
        this.chartData.push(othersData);
        this.pieChart(this.chartData);
      }
      this.tabsLoaded.allFeeds.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadFeedsTransactions(){
    const obj = {
      clientId: this.clientData.id, 
      advisorId: this.advisorId,
      limit: 5
    }
    this.loaderFn.increaseCounter();
    this.customerService.getMFData(obj).subscribe(res => {
      if(res == null) {
        this.feedsData.recentTransactions = null;
      } else {
        this.tabsLoaded.allFeeds.hasData = true;
        this.feedsData.recentTransactions = res;
      }
      this.tabsLoaded.allFeeds.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadDocumentValutData(){
    const obj = {
      clientId: this.clientData.id, 
      advisorId: this.advisorId,
      limit: -1
    }
    this.loaderFn.increaseCounter();
    this.customerService.getDocumentsFeed(obj).subscribe(res => {
      if(res == null) {
        this.feedsData.documents = [];
      } else {
        this.tabsLoaded.transactions.hasData = true;
        this.feedsData.documents = res;
      }
      this.tabsLoaded.allFeeds.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadRiskProfile(){
    const obj = {
      clientId: this.clientData.id,
      advisorId: this.advisorId
    }
    this.customerService.getRiskProfile(obj).subscribe(res => {
      if(res == null) {
        this.riskProfileData = null;
      } else {
        this.tabsLoaded.education.hasData = true;
        this.riskProfileData = res[0];
      }
      this.tabsLoaded.education.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }
  
  pieChart(data) {
    this.chart.removeSeries(0);
    this.chart.addSeries({
      type: 'pie',
      name: 'Asset allocation',
      innerSize: '60%',
      data: data,
    }, true, true);
  }
}
