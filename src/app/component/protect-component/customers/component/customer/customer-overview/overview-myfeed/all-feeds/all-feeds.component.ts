import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/services/app-constants';
import { CustomerService } from '../../../customer.service';
import { LoaderFunction } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Chart } from 'angular-highcharts';
import { PlanService } from '../../../plan/plan.service';

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
    private plansService: PlanService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.orgDetails = authService.orgData;
    this.clientData = AuthService.getClientData();
  }

  tabsLoaded = {
    portfolioSummary:{
      dataLoaded: false,
      hasData: false,
    },
    rtaFeeds:{
      dataLoaded: false,
      hasData: false,
    },
    recentTransactions:{
      dataLoaded: false,
      hasData: false,
    },
    documentsVault:{
      dataLoaded: false,
      hasData: false,
    },
    riskProfile:{
      dataLoaded: false,
      hasData: false,
    },
    globalRiskProfile:{
      dataLoaded: false,
      hasData: false,
    },
    goalsData:{
      dataLoaded: false,
      hasData: false,
    }
  };
  hasError:boolean = false;

  portFolioData:any[] = [];
  rtaFeedsData:any[] = [];
  recentTransactions:any[] = [];
  riskProfile:any[] = [];
  globalRiskProfile:any[] = [];
  documentVault:any[] = [];
  adviseData:any = null;
  goalsData:any[] = [];


  ngOnInit() {
    this.initializePieChart();
    this.loadPortfolioSummary();
    this.loadRTAFeedsTransactions();
    this.loadRecentTransactions();
    this.loadDocumentValutData();
    this.loadRiskProfile();
    this.loadGlobalRiskProfile();
    // this.loadGoalsData();
  }

  initializePieChart(){
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
  }

  loadPortfolioSummary(){
    const obj = {
      clientId: this.clientData.clientId, 
      advisorId: this.advisorId,
      targetDate: new Date().getTime()
    }

    // ?advisorId=2808&clientId=53004&targetDate=1587965868704
    this.loaderFn.increaseCounter();
    this.customerService.getAllFeedsPortFolio(obj).subscribe(res => {
      if(res == null) {
        this.portFolioData = [];
      } else {
        this.tabsLoaded.portfolioSummary.hasData = true;
        this.portFolioData = res;

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
      this.tabsLoaded.portfolioSummary.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadRTAFeedsTransactions(){
    const obj = {
      clientId: this.clientData.clientId, 
      advisorId: this.advisorId,
      limit: 5
    }
    this.loaderFn.increaseCounter();
    this.customerService.getRTAFeeds(obj).subscribe(res => {
      if(res == null) {
        this.rtaFeedsData = [];
      } else {
        this.tabsLoaded.rtaFeeds.hasData = true;
        this.rtaFeedsData = res;
      }
      this.tabsLoaded.rtaFeeds.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadDocumentValutData(){
    const obj = {
      clientId: this.clientData.clientId, 
      advisorId: this.advisorId,
      limit: 5
    }
    this.loaderFn.increaseCounter();
    this.customerService.getDocumentsFeed(obj).subscribe(res => {
      if(res == null) {
        this.documentVault = [];
      } else {
        this.tabsLoaded.documentsVault.hasData = true;
        this.documentVault = res;
      }
      this.tabsLoaded.documentsVault.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadRiskProfile(){
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId
    }
    this.customerService.getRiskProfile(obj).subscribe(res => {
      if(res == null) {
        this.riskProfile = [];
      } else {
        this.tabsLoaded.riskProfile.hasData = true;
        this.riskProfile = res;
      }
      this.tabsLoaded.riskProfile.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadGlobalRiskProfile(){
    this.customerService.getGlobalRiskProfile({}).subscribe(res => {
      if(res == null) {
        this.globalRiskProfile = [];
      } else {
        this.tabsLoaded.globalRiskProfile.hasData = true;
        this.globalRiskProfile = res;
      }
      this.tabsLoaded.globalRiskProfile.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadRecentTransactions(){
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      startDate: startDate.getTime(),
      endDate: endDate.getTime()
    }
    this.loaderFn.increaseCounter();

    this.customerService.getRecentTransactions(obj).subscribe(res => {
      if(res == null) {
        this.recentTransactions = [];
      } else {
        this.tabsLoaded.recentTransactions.hasData = true;
        this.recentTransactions = res;
      }
      this.tabsLoaded.recentTransactions.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadGoalsData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId
    }

    this.loaderFn.increaseCounter();
    this.plansService.getAllGoals(obj).subscribe((res)=>{
      if(res == null) {
        this.goalsData = [];
      } else {
        this.tabsLoaded.goalsData.hasData = true;
        this.goalsData = res;
      }
      this.tabsLoaded.goalsData.dataLoaded = true;
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
      this.hasError = true;
    })
  }
  
  pieChart(data) {
    this.chart.removeSeries(0);
    this.chart.addSeries({
      type: 'pie',
      name: 'Asset allocation',
      innerSize: '60%',
      data: data,
    }, false, true);
  }

  riskProfileMaxScore(id) {
    if(this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).scoreUpperLimit;
    } else {
      return 1;
    }
  }

  riskProfileDesc(id) {
    if(this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).id;
    } else {
      return 'Dummy risk profile description';
    }
  }
}
