import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { LoaderFunction, UtilService } from 'src/app/services/util.service';
import { EventService } from 'src/app/Data-service/event.service';
import { Chart } from 'angular-highcharts';
import { AppConstants } from 'src/app/services/app-constants';
import { RoutingState } from 'src/app/services/routing-state.service';
import { slideInAnimation } from 'src/app/animation/router.animation';
import { PlanService } from '../../plan/plan.service';
import { Router } from '@angular/router';
import { OrgSettingServiceService } from 'src/app/component/protect-component/AdviserComponent/setting/org-setting-service.service';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { DatePipe } from '@angular/common';
import { MfServiceService } from '../../accounts/assets/mutual-fund/mf-service.service';
import { WebworkerService } from 'src/app/services/web-worker.service';

@Component({
  selector: 'app-overview-myfeed',
  templateUrl: './overview-myfeed.component.html',
  styleUrls: ['./overview-myfeed.component.scss'],
  providers: [LoaderFunction],
  animations: [
    slideInAnimation,
  ]
})
export class OverviewMyfeedComponent implements OnInit, AfterViewInit, OnDestroy {
  clientData: any;
  advisorId: any;
  orgDetails: any;
  assetAllocationPieConfig: Chart;
  mfAllocationPieConfig: Chart;
  mfSubCategoryPieConfig: Chart;
  cashflowColumns = ['bankName', 'inflow', 'outflow', 'netflow'];
  displayedColumns: string[] = ['description', 'date', 'amount'];
  cashFlowViewDataSource = [];
  welcomeMessage = '';

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

  sliderConfig = {
    slidesToShow: 1.5,
    infinite: false,
    variableWidth: true,
    "nextArrow": "<div style='position: absolute; top: 35%; right: 0; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/next-arrow.svg'></div>",
    "prevArrow": "<div style='position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;' class='nav-btn classNextArrow next-slide'><img src='/assets/images/svg/pre-arrow.svg'></div>",
  }

  chartTotal = 100;
  clientId: any;
  expenseList = [];
  incomeList = [];
  advisorInfo: any;
  advisorImg: string = '';

  totalValue: any = {};
  filterData: any;
  mfAllocationData:any[] = [
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
      color: AppConstants.DONUT_CHART_COLORS[3],
      dataLabels: {
        enabled: false
      }
    }, {
      name: 'OTHERS',
      y: 0,
      color: AppConstants.DONUT_CHART_COLORS[4],
      dataLabels: {
        enabled: false
      }
    }
  ]
  mfSubCatAllocationData:any[] = [];
  worker:Worker;
  currentViewId = 1;
  greeterFnID:any;
  mutualFund: any;

  constructor(
    private customerService: CustomerService,
    public loaderFn: LoaderFunction,
    private eventService: EventService,
    private authService: AuthService,
    private plansService: PlanService,
    private router: Router,
    private orgSetting: OrgSettingServiceService,
    private enumSerice: EnumServiceService,
    private datePipe: DatePipe,
    private mfServiceService: MfServiceService,
    private workerService: WebworkerService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.orgDetails = authService.orgData;
    if (!this.orgDetails) {
      this.orgDetails = {};
    }
    this.clientData = AuthService.getClientData();
    this.clientId - AuthService.getClientId();
    this.advisorInfo = AuthService.getAdvisorDetails();
    this.advisorImg = this.advisorInfo.profilePic;
    this.greeter();
    this.greeterFnID = setInterval(()=> this.greeter(), 1000);
  }

  tabsLoaded = {
    portfolioData: {
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
      displaySection: false,
    },
    cashflowData: {
      dataLoaded: false,
      hasData: false,
    },
    customerProfile: {
      dataLoaded: false,
      hasData: false,
    },
    mfPortfolioSummaryData: {
      dataLoaded: false,
      hasData: false,
      displaySection: false,
    },
    mfSubCategorySummaryData: {
      dataLoaded: false,
      hasData: false,
      displaySection: false,
    },
    familyMembers: {
      dataLoaded: false,
      hasData: false,
    }
  };
  hasError: boolean = false;

  portFolioData: any[] = [];
  rtaFeedsData: any[] = [];
  recentTransactions: any[] = [];
  riskProfile: any[] = [];
  globalRiskProfile: any[] = [];
  documentVault: any = {};
  adviseData: any = null;
  goalsData: any[] = [];
  cashflowData: any = {};
  customerProfile: any = {
    familyMemberCount: 0,
    completenessStatus: 0,
  };
  portfolioSummaryData: any[] = [];
  familyWiseAllocation: any[] = [];
  appearancePortfolio:any = {};
  familyMembers: any[] = [];


  // highlight scroll links solution
  // https://stackoverflow.com/a/54447174
  @ViewChild('allFeedsSection', {static: true}) allFeedsSection: ElementRef;
  @ViewChild('riskProfileSection', {static: true}) riskProfileSection: ElementRef;
  @ViewChild('cashFlowSection', {static: true}) cashFlowSection: ElementRef;
  @ViewChild('portFolioSection', {static: true}) portFolioSection: ElementRef;
  allFeedsSectionOffset:any = 0;
  riskProfileSectionOffset:any = 0;
  cashFlowSectionOffset:any = 0;
  portFolioSectionOffset:any = 0;

  ngOnInit() {
    this.loadLogicBasedOnRoleType();
    this.getFamilyMembersList();
    this.loadCustomerProfile();
    this.getAppearanceSettings();
    this.initializePieChart();
    this.loadAssetAlocationData();
    this.loadRTAFeedsTransactions();
    this.loadRecentTransactions();
    this.loadDocumentValutData();
    this.loadRiskProfile();
    this.loadGlobalRiskProfile();
    // this.loadGoalsData(); // Not to be implemented for demo purpose
    this.loadCashFlowSummary(); // needs better implementation
    this.getMFPortfolioData();
  }

  ngAfterViewInit() {
    // offset by 60, the height of upper nav
    this.allFeedsSectionOffset = this.allFeedsSection.nativeElement.offsetTop;
    this.cashFlowSectionOffset = this.cashFlowSection.nativeElement.offsetTop;
    this.portFolioSectionOffset = this.portFolioSection.nativeElement.offsetTop;
    this.riskProfileSectionOffset = this.riskProfileSection.nativeElement.offsetTop;
  }

  @HostListener('window:scroll')
  checkOffsetTop() {
    this.allFeedsSectionOffset = this.allFeedsSection.nativeElement.offsetTop;
    this.cashFlowSectionOffset = this.cashFlowSection.nativeElement.offsetTop;
    this.portFolioSectionOffset = this.portFolioSection.nativeElement.offsetTop;
    this.riskProfileSectionOffset = this.riskProfileSection.nativeElement.offsetTop;
    if (window.pageYOffset < this.portFolioSectionOffset) {
      this.currentViewId = 1;
    } else if (window.pageYOffset < this.cashFlowSectionOffset) {
      this.currentViewId = 2;
    } else if (window.pageYOffset < this.riskProfileSectionOffset) {
      this.currentViewId = 3;
    } else if (window.pageYOffset >= this.riskProfileSectionOffset) {
      this.currentViewId = 4;
    }
  }

  goToSectionView(scrollOffset) {
    // offset by 60, the height of upper nav
    window.scrollTo(0, scrollOffset)
  }

  // logic to decide which apis to load and not load
  // decides apis to be called based on the role type of clients:- MF, MF+assets and so on

  // TODO:- change ids at later stage
  loadLogicBasedOnRoleType() {
    console.log(this.enumSerice.getClientRole());
    // break intentionally not applied. DO NOT ADD BREAKS!!!!!
    switch(this.clientData.advisorOrClientRole) {
      case 0: // because currently system is giving it as 0 :(
      case 7:
      case 6:
        this.tabsLoaded.goalsData.displaySection = true;
      case 5:
      case 4:
        this.tabsLoaded.mfPortfolioSummaryData.displaySection = true;
        break;
      default:
        // this.tabsLoaded.mfPortfolioSummaryData.displaySection = true;
        console.error("Unidentified role type found", this.clientData.advisorOrClientRole);
        break;
    }
  }


  // Load data from various apis
  loadCustomerProfile() {
    const obj = {
      // advisorId: this.advisorId,
      clientId: this.clientId,
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
        this.tabsLoaded.customerProfile.dataLoaded = false;
        this.loaderFn.decreaseCounter();
      }
    )
  }

  getAppearanceSettings(){
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
    let chartConfig:any = {
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
          center: ['52%', '55%'],
          size: '120%'
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

    chartConfig.series = [{
      type: 'pie',
      animation: false,
      name: 'MF Asset allocation',
      innerSize: '60%',
      data: this.mfAllocationData
    }]
    this.mfAllocationPieConfig = new Chart(chartConfig);
    this.mfSubCategoryPieConfig = new Chart(chartConfig);
  }

  loadAssetAlocationData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
      targetDate: new Date().getTime()
    }

    this.loaderFn.increaseCounter();
    this.customerService.getAllFeedsPortFolio(obj).subscribe(res => {
      if (res == null) {
        this.portFolioData = [];
        this.tabsLoaded.portfolioData.hasData = false;
      } else {
        this.tabsLoaded.portfolioData.hasData = true;
        this.portFolioData = res;

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
        res.forEach(element => {
          if (element.investedAmount > 0) {
            chartTotal += element.investedAmount;
            if (counter < 4) {
              chartData.push({
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
          } else {
            hasNoDataCounter--;
          }
        });
        if(hasNoDataCounter === 0) {
          this.tabsLoaded.portfolioData.hasData = false;
        }
        chartTotal -= 1;
        if (counter > 4) {
          chartData.push(othersData);
        }
        if(counter > 0) {
          this.chartTotal = chartTotal;
          this.chartData = chartData;
          this.assetAllocationPieChartDataMgnt(this.chartData);
        }
      }
      this.tabsLoaded.portfolioData.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.tabsLoaded.portfolioData.dataLoaded = false;
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
      if (res == null || res.fileStats.length == 0) {
        this.documentVault = {};
        this.tabsLoaded.documentsVault.hasData = false;
      } else {
        this.tabsLoaded.documentsVault.hasData = true;
        this.documentVault = res;
        this.documentVault.familyStats.unshift({
          relationshipId: (this.clientData.genderId == 1 ? 2 : 3),
          genderId: 0
        })
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
    this.loaderFn.increaseCounter();
    this.customerService.getRiskProfile(obj).subscribe(res => {
      if (res == null || res[0].id === 0) {
        this.riskProfile = [];
        this.tabsLoaded.riskProfile.hasData = false;
      } else {
        this.tabsLoaded.riskProfile.hasData = true;
        this.riskProfile = res;
      }
      this.tabsLoaded.riskProfile.dataLoaded = true;
      this.loaderFn.decreaseCounter();
    }, err => {
      this.tabsLoaded.riskProfile.dataLoaded = false;
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
      this.tabsLoaded.globalRiskProfile.dataLoaded = false;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadRecentTransactions() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId,
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
      this.tabsLoaded.recentTransactions.dataLoaded = false;
      this.eventService.openSnackBar(err, "Dismiss")
      this.loaderFn.decreaseCounter();
    })
  }

  loadGoalsData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId
    }

    if(this.tabsLoaded.goalsData.displaySection) {
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
        this.tabsLoaded.goalsData.hasData = false;
        this.eventService.openSnackBar(err, "Dismiss")
        this.loaderFn.decreaseCounter();
        this.hasError = true;
      })
    }
  }

  // logics section below
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
        this.tabsLoaded.cashflowData.hasData = true;
        this.createCashflowFamilyObj(res);
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
    // create list of all transactions
    if (data.income && data.income.length > 0) {
      tnx.push(data.income)
    }
    if (data.expense && data.expense.length > 0) {
      tnx.push(data.expense)
    }
    tnx = tnx.flat();

    // show empty state if no data
    if(tnx.length == 0) {
      this.cashflowData = {
        emptyData: [{
          bankName: 'Not enough data to display',
          inflow: 0,
          outflow: 0,
          netflow: 0
        }]
      };
      this.tabsLoaded.cashflowData.hasData = false;
      return;
    }

    // group by family
    let familyMembers = [...new Set(tnx.map(obj => obj.familyMemberId))];
    let totalIncome = 0;
    let totalExpense = 0;

    // create view obj
    let leddger = familyMembers.map((famId) => {
      // get all transactions of a particular family member
      let transactions = tnx.filter((tnx) => tnx.familyMemberId == famId);

      // get all accounts of the family member (banks and non-banks)
      let all_accounts = [...new Set(transactions.map(obj => obj.userBankMappingId))];

      // create bank wise leddger objs
      let cashflowLedgger = all_accounts.map(bank =>{
        // filter transactions as per bank
        let account_transactions = transactions.filter(tnx => tnx.userBankMappingId == bank);
        let account_income = 0;
        let account_expense = 0;

        // group inflow and outflows as per the bank
        account_transactions.forEach((obj) => {
          if (obj.inputOutputFlag > 0) {
            totalIncome += obj.currentValue;
            account_income += obj.currentValue;
          } else {
            totalExpense += obj.currentValue;
            account_expense += obj.currentValue;
          }
        })
        let leddger = {
          bankName: 'need to be mapped' + bank,
          inflow: account_income,
          outflow: account_expense,
          netflow: account_income - account_expense
        }

        // non linked bank = 0
        if(bank == 0) {
          leddger.bankName = "Non-linked bank";
        }
        return leddger;
      })

      // create leddger table obj for each family
      return {
        familyMemberId: famId,
        familyMemberFullName: transactions[0].ownerName,
        cashflowLedgger: cashflowLedgger
      }
    })

    let total = [{
      bankName: 'All In-flows & Out-flows',
      inflow: totalIncome.toFixed(2),
      outflow: totalExpense.toFixed(2),
      netflow: (totalIncome - totalExpense).toFixed(2),
    }]

    this.cashflowData = {
      cashflowData: leddger,
      total: total
    }
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

  riskProfileMaxScore(id) {
    if (this.globalRiskProfile.length > 0) {
      return this.globalRiskProfile.find(data => data.id == id).scoreUpperLimit;
    } else {
      return 0;
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
    switch (value) {
      case 'Fixed Income':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab3' } });
        break;
      case 'Real estate':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab4' } });
        break;
      case 'Stocks':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab2' } });
        break;
      case 'Mutual funds':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab1' } });
        break;
      case 'Retirement accounts':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab5' } });
        break;
      case 'Small savings':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab6' } });
        break;
      case 'Cash and bank':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab7' } });
        break;
      case 'Commodities':
        this.router.navigate(['/customer/detail/account/assets'], { queryParams: { tab: 'tab8' } });
        break;
      case 'Documents':
        this.router.navigate(['/customer/detail/overview/documents']);
        break;
      default:
        this.router.navigate(['/customer/detail/account/liabilities']);
        break;
    }
  }

  carouselWheelEvent(carousel, event) {
    event.preventDefault();
    if(event.deltaY > 0) {
      carousel.slickNext();
    } else {
      carousel.slickPrev();
    }
  }

  getMFPortfolioData() {
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.advisorId
    }

    if(this.tabsLoaded.mfPortfolioSummaryData.displaySection) {
      this.loaderFn.increaseCounter();
  
      this.customerService.getMutualFund(obj).subscribe(
        data => this.getMutualFundResponse(data), (error) => {
          this.eventService.openSnackBar(error, "DISMISS");
          this.tabsLoaded.mfPortfolioSummaryData.dataLoaded = false;
        }
      );
    }
  }

  getFamilyMembersList() {
    this.loaderFn.increaseCounter();
    const obj = {
      clientId: this.clientId,
      id: 0 // why is this required?
    };
    this.customerService.getFamilyMembers(obj).subscribe(
      data => {
        this.familyMembers = data;
        this.tabsLoaded.familyMembers.dataLoaded = true;
        this.tabsLoaded.familyMembers.hasData = true;
      },
      err => {
        this.tabsLoaded.familyMembers.dataLoaded = false;
        this.eventService.openSnackBar(err, "Dismiss");
        console.error(err);
      }
    );
  }

  // copied from MF overview
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

  getMutualFundResponse(data) {
    if (data) {
      this.filterData = this.mfServiceService.doFiltering(data);
      this.mutualFund = this.filterData;
      this.asyncFilter(this.filterData.mutualFundList, this.filterData.mutualFundCategoryMastersList)
      this.generateSubCategorywiseAllocationData(data); // For subCategoryWiseAllocation
      this.getFamilyMemberWiseAllocation(data); // for FamilyMemberWiseAllocation
    }
  }


  generateMFallocationChartData(data) {// function for calculating percentage
    // this.mfAllocationData = [];
    let counter = 0;
    data.forEach(element => {
      switch(element.category) {
        case 'DEBT':
            this.mfAllocationData.push({
              name: element.category,
              y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
              color: AppConstants.DONUT_CHART_COLORS[1],
              dataLabels: {
                enabled: false
              }
            })
            counter ++;
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
            counter ++;
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
            counter ++;
            break;
        case 'SOLUTION ORIENTED':
          this.mfAllocationData.push({
            name: element.category,
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[3],
            dataLabels: {
              enabled: false
            }
          })
          counter ++;
          break;
        default:
          this.mfAllocationData.push({
            name: 'OTHERS',
            y: parseFloat(((element.currentValue / this.totalValue.currentValue) * 100).toFixed(2)),
            color: AppConstants.DONUT_CHART_COLORS[4],
            dataLabels: {
              enabled: false
            }
          })
          counter ++;
          break;
      }
    });
    this.mfAllocationData = [...new Map(this.mfAllocationData.map(item => [item.name, item])).values()];
    this.mfAllocationData.forEach(e => {
      e.name = e.name[0].toUpperCase() + e.name.slice(1).toLowerCase();
    })
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


  generateSubCategorywiseAllocationData(data) {
    let subCatChartData = this.mfServiceService.filter(data.mutualFundCategoryMastersList, 'mutualFundSubCategoryMaster');
    subCatChartData = subCatChartData.sort((a,b) => a.allocatedPercentage - b.allocatedPercentage)
    let counter = 0;
    this.mfSubCatAllocationData = [];
    let othersData = {
      name: 'Others',
      y:0,
      color: AppConstants.DONUT_CHART_COLORS[4],
      dataLabels: {enabled:false}
    }
    subCatChartData.forEach(data => {
      if(counter < 4) {
        this.mfSubCatAllocationData.push({
          name: data.subCategory,
          y: parseFloat((data.allocatedPercentage).toFixed(2)),
          color: AppConstants.DONUT_CHART_COLORS[counter],
          dataLabels: {
            enabled: false
          }
        })
        counter ++;
      } else {
        othersData.y += data.allocatedPercentage
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

  getFamilyMemberWiseAllocation(data) {
    this.familyWiseAllocation = data.family_member_list;
  }

  ngOnDestroy(){
    if(this.worker) this.worker.terminate();
    clearInterval(this.greeterFnID);
  }

  greeter() {
    var date = new Date();  
    var hour = date.getHours();  
    if (hour < 12) {  
      this.welcomeMessage = "Good morning";  
    } else if (hour < 17) {  
      this.welcomeMessage = "Good afternoon";  
    } else {  
      this.welcomeMessage = "Good evening";  
    }  
  }

  getTnxStatus(id) {
    return UtilService.getTransactionStatusFromStatusId(id);
  }
}