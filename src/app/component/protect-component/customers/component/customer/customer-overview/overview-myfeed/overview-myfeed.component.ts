import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { LoaderFunction } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-overview-myfeed',
  templateUrl: './overview-myfeed.component.html',
  styleUrls: ['./overview-myfeed.component.scss'],
  providers: [LoaderFunction]
})
export class OverviewMyfeedComponent implements OnInit {
  clientData: any;

  constructor(
    private customerService: CustomerService,
    private loaderFn: LoaderFunction
  ) { }

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
    }
  };

  currentTab:number = 1;
  hasError:boolean = false;
  hasNoData:boolean = false;

  feedsData:any = {};
  portFolioData:any = {};
  planData:any = {};
  activityData:any = {};
  transactionsData:any = {};
  profileData:any = {};
  educationData:any = {};
  videosData:any = {};


  ngOnInit() {
    this.clientData = AuthService.getClientData();
    this.changeTab(1);
    this.pieChart();
  }

  changeTab(index) {
    this.currentTab = index;

    switch (index) {
      case 1:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 2:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 3:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 4:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 5:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 6:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 7:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      case 8:
        if (!this.tabsLoaded.allFeeds.dataLoaded) {
          this.loadAllFeeds();
        }
        break;
      default:
        break;
    }
  }

  loadAllFeeds(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.feedsData = {};
      } else {
        this.tabsLoaded.allFeeds.hasData = true;
        this.feedsData = res;
      }
      this.tabsLoaded.allFeeds.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }

  loadPortfolio(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.profileData = {};
      } else {
        this.tabsLoaded.portfolio.hasData = true;
        this.profileData = res;
      }
      this.tabsLoaded.portfolio.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }

  loadPlan(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.planData = {};
      } else {
        this.tabsLoaded.plan.hasData = true;
        this.planData = res;
      }
      this.tabsLoaded.plan.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }

  loadActivity(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.activityData = {};
      } else {
        this.tabsLoaded.activity.hasData = true;
        this.activityData = res;
      }
      this.tabsLoaded.activity.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }

  loadTransactions(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.transactionsData = {};
      } else {
        this.tabsLoaded.transactions.hasData = true;
        this.transactionsData = res;
      }
      this.tabsLoaded.transactions.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }

  loadProfile(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.profileData = {};
      } else {
        this.tabsLoaded.profile.hasData = true;
        this.profileData = res;
      }
      this.tabsLoaded.profile.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }

  loadEducation(){
    const obj = {clientId: this.clientData.clientId, advisorId: this.clientData.advisorId}
    this.loaderFn.increaseCounter();
    this.hasError = false;
    this.customerService.getAllFeeds(obj).subscribe(res => {
      if(res == null) {
        this.educationData = {};
      } else {
        this.tabsLoaded.education.hasData = true;
        this.educationData = res;
      }
      this.tabsLoaded.education.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.loaderFn.decreaseCounter();
    })
  }


  
  pieChart() {
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
        name: 'Browser share',
        innerSize: '60%',
        data: [
          {
            name: 'Equity',
            // y:20,
            y: 10,
            color: '#008FFF',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Fixed income',
            // y:20,
            y: 10,
            color: '#5DC644',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Commodities',
            // y:20,
            y: 10,
            color: '#FFC100',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Real estate',
            // y:20,
            y: 10,
            color: '#A0AEB4',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Others',
            // y:20,
            y: 10,
            color: '#FF7272',
            dataLabels: {
              enabled: false
            }
          }
        ]
      }]
    });
  }
}
