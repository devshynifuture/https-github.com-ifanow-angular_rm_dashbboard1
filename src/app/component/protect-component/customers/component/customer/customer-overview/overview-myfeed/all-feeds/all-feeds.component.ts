import { Component, OnInit } from '@angular/core';
import { AppConstants } from 'src/app/services/app-constants';
import { CustomerService } from '../../../customer.service';
import { LoaderFunction } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { Chart } from 'angular-highcharts';
import { PlanService } from '../../../plan/plan.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/component/protect-component/AdviserComponent/setting/settings.service';
import { OrgSettingServiceService } from 'src/app/component/protect-component/AdviserComponent/setting/org-setting-service.service';

@Component({
  selector: 'app-all-feeds',
  templateUrl: './all-feeds.component.html',
  styleUrls: ['./all-feeds.component.scss'],
  providers: [LoaderFunction]
})
export class AllFeedsComponent implements OnInit {
  clientData: any;
  advisorId: any;
  orgDetails: any;
  chart: Chart;
  cashflowColumns = ['bankName', 'inflow', 'outflow', 'netflow'];
  displayedColumns: string[] = ['description', 'date', 'amount'];
  cashFlowViewDataSource = [];

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

  // vaibhav
  portfolioConfig = {
    slidesToShow: 1.5,
    infinite: false,
    "nextArrow": "<div style='position: absolute; top: 35%; right: 0; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/next-arrow.svg'></div>",
    "prevArrow": "<div style='position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/pre-arrow.svg'></div>",
  }

  // vaibhav
  recentTnxConfig = {
    slidesToShow: 1.4,
    infinite: false,
    "nextArrow": "<div style='position: absolute; top: 35%; right: 0; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/next-arrow.svg'></div>",
    "prevArrow": "<div style='position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/pre-arrow.svg'></div>",
  }

  chartTotal = 100;
  clientId: any;
  expenseList = [];
  incomeList = [];
  advisorInfo: any;
  advisorImg: string = '';

  constructor(
    private customerService: CustomerService,
    public loaderFn: LoaderFunction,
    private eventService: EventService,
    private authService: AuthService,
    private plansService: PlanService,
    private datePipe: DatePipe,
    private router: Router,
    private orgSetting: OrgSettingServiceService
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.orgDetails = authService.orgData;
    if (!this.orgDetails) {
      this.orgDetails = {};
    }
    this.clientData = AuthService.getClientData();
    this.clientId - AuthService.getClientId();
    this.advisorInfo = AuthService.getUserInfo();
    this.advisorImg = authService.profilePic;
  }

  tabsLoaded = {
    portfolioSummary: {
      dataLoaded: false,
      hasData: false,
    },
    rtaFeeds: {
      dataLoaded: false,
      hasData: false,
    },
    recentTransactions: {
      dataLoaded: false,
      hasData: false,
    },
    documentsVault: {
      dataLoaded: false,
      hasData: false,
    },
    riskProfile: {
      dataLoaded: false,
      hasData: false,
    },
    globalRiskProfile: {
      dataLoaded: false,
      hasData: false,
    },
    goalsData: {
      dataLoaded: false,
      hasData: false,
    },
    cashflowData: {
      dataLoaded: false,
      hasData: false,
    },
    customerProfile: {
      dataLoaded: false,
      hasData: false,
    },
  };
  hasError: boolean = false;

  portFolioData: any[] = [];
  rtaFeedsData: any[] = [];
  recentTransactions: any[] = [];
  riskProfile: any[] = [];
  globalRiskProfile: any[] = [];
  documentVault: any[] = [];
  adviseData: any = null;
  goalsData: any[] = [];
  cashflowData: any = {};
  customerProfile: any = {
    familyMemberCount: 0,
    completenessStatus: 0,
  };
  appearancePortfolio: any = {};

  ngOnInit() {
    this.loadCustomerProfile();
    this.getAppearance();
    this.initializePieChart();
    this.loadPortfolioSummary();
    this.loadRTAFeedsTransactions();
    this.loadRecentTransactions();
    this.loadDocumentValutData();
    this.loadRiskProfile();
    this.loadGlobalRiskProfile();
    // this.loadGoalsData(); // Not to be implemented for demo purpose
    this.loadCashFlowSummary(); //To be implemented later
  }

  loadCustomerProfile() {
    const obj = {
      advisorId: this.advisorId,
      clientId: 1,
      userId: this.clientData.userId
    }

    this.loaderFn.increaseCounter();
    this.customerService.getCustomerFeedsProfile(obj).subscribe(
      res => {
        if (res == null) {
          this.customerProfile = {
            familyMemberCount: 0,
            completenessStatus: 0,
          }
        } else {
          this.customerProfile = res;
          this.tabsLoaded.customerProfile.hasData = true;
        }
        this.loaderFn.decreaseCounter();
        this.tabsLoaded.customerProfile.dataLoaded = true;
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.loaderFn.decreaseCounter();
      }
    )
  }


  getAppearance() {
    this.loaderFn.increaseCounter()
    let obj = {
      advisorId: this.advisorId
    }
    this.orgSetting.getAppearancePreference(obj).subscribe(
      data => {
        this.appearancePortfolio = data.find(data => data.appearanceOptionId == 1).advisorOrOrganisation
      },
      err => {
        this.eventService.openSnackBar(err, "Dismiss")
        this.hasError = true;
      }
    );
  }

  initializePieChart() {
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

  loadPortfolioSummary() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      targetDate: new Date().getTime()
    }

    // ?advisorId=2808&clientId=53004&targetDate=1587965868704
    this.loaderFn.increaseCounter();
    this.customerService.getAllFeedsPortFolio(obj).subscribe(res => {
      if (res == null) {
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
          if (element.investedAmount > 0) {
            this.chartTotal += element.investedAmount;
            if (counter < 4) {
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
            counter++;
          }
        });
        this.chartTotal -= 1;
        if (counter > 4) {
          this.chartData.push(othersData);
        }
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

  loadRTAFeedsTransactions() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      limit: 5
    }
    this.loaderFn.increaseCounter();
    this.customerService.getRTAFeeds(obj).subscribe(res => {
      if (res == null) {
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

  loadDocumentValutData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      limit: 5
    }
    this.loaderFn.increaseCounter();
    this.customerService.getDocumentsFeed(obj).subscribe(res => {
      if (res == null) {
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

  loadRiskProfile() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId
    }
    this.customerService.getRiskProfile(obj).subscribe(res => {
      if (res == null) {
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

  loadGlobalRiskProfile() {
    this.customerService.getGlobalRiskProfile({}).subscribe(res => {
      if (res == null) {
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

  loadRecentTransactions() {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 15);

    const obj = {
      clientId: 53637, //this.clientData.clientId,
      advisorId: 414, //this.advisorId,
      familyMemberId: 0
    }

    this.loaderFn.increaseCounter();

    this.customerService.getRecentTransactions(obj).subscribe(res => {
      if (res == null) {
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
    this.plansService.getAllGoals(obj).subscribe((res) => {
      if (res == null) {
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

  loadCashFlowSummary() {
    const startDate = new Date();
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      targetDate: startDate.getTime()
    }
    this.loaderFn.increaseCounter();
    this.customerService.getCashFlowList(obj).subscribe(res => {
      if (res == null) {
        this.cashflowData = {
          emptyData: [{
            bankName: 'Not enough data to display',
            inflow: 0,
            outflow: 0,
            netflow: 0
          }]
        };
      } else {
        this.createCashflowFamilyObj(res);
        this.tabsLoaded.cashflowData.hasData = true;
      }
      this.tabsLoaded.cashflowData.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  createCashflowFamilyObj(data) {
    let tnx = [];
    if (data.income && data.income.length > 0) {
      tnx.push(data.income)
    }
    if (data.expense && data.expense.length > 0) {
      tnx.push(data.expense)
    }
    tnx = tnx.flat();

    let familyMembers = [...new Set(tnx.map(obj => obj.ownerName))];
    let totalIncome = 0;
    let totalExpense = 0;

    let leddger = familyMembers.map((famId) => {
      let transactions = tnx.filter((tnx) => tnx.ownerName == famId);
      let income = 0;
      let expense = 0;
      transactions.forEach((obj) => {
        if (obj.inputOutputFlag > 0) {
          income += obj.currentValue;
        } else {
          expense += obj.currentValue;
        }
      })

      totalExpense += expense;
      totalIncome += income;

      return {
        familyMemberId: famId,
        familyMemberFullName: transactions[0].ownerName,
        cashflowLedgger: [
          {

            bankName: 'N/A',
            inflow: income,
            outflow: expense,
            netflow: income - expense
          }
        ]
      }
    })

    let total = [{
      bankName: 'All In-flows & Out-flows',
      inflow: totalIncome,
      outflow: totalExpense,
      netflow: totalIncome - totalExpense,
    }]

    this.cashflowData = {
      cashflowData: leddger,
      total: total
    }
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

  riskProfileMaxScore(id) {
    if (this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).scoreUpperLimit;
    } else {
      return 1;
    }
  }

  riskProfileDesc(id) {
    if (this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).description;
    } else {
      return '';
    }
  }

  routeAndAddQueryParams(value) {
    switch (true) {
      case (value == 'Fixed Income'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab3' } });
        break;
      case (value == 'Real estate'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab4' } });
        break;
      case (value == 'Stocks'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab2' } });
        break;
      case (value == 'Mutual funds'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab1' } });
        break;
      case (value == 'Retirement accounts'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab5' } });
        break;
      case (value == 'Small savings'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab6' } });
        break;
      case (value == 'Cash and bank'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab7' } });
        break;
      case (value == 'Commodities'):
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab8' } });
        break;
      default:
        this.router.navigate(['/customer/detail/account/liabilities']);
        break;
    }
  }
}
