import { AddTasksComponent } from '../Activities/crm-tasks/add-tasks/add-tasks.component';
import { CrmTaskService } from '../Activities/crm-tasks/crm-task.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DashboardGuideDialogComponent } from './dashboard-guide-dialog/dashboard-guide-dialog.component';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionService } from '../Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FixedFeeComponent } from '../Subscriptions/subscription/common-subscription-component/fixed-fee/fixed-fee.component';
import { VariableFeeComponent } from '../Subscriptions/subscription/common-subscription-component/variable-fee/variable-fee.component';
import { SubscriptionInject } from '../Subscriptions/subscription-inject.service';
import { UtilService } from 'src/app/services/util.service';
import { BillerSettingsComponent } from '../Subscriptions/subscription/common-subscription-component/biller-settings/biller-settings.component';
import { InvoiceHistoryComponent } from '../Subscriptions/subscription/common-subscription-component/invoice-history/invoice-history.component';
import { ChangePayeeComponent } from '../Subscriptions/subscription/common-subscription-component/change-payee/change-payee.component';
import { DeleteSubscriptionComponent } from '../Subscriptions/subscription/common-subscription-component/delete-subscription/delete-subscription.component';
import { ConfirmDialogComponent } from '../../common-component/confirm-dialog/confirm-dialog.component';
import { BackOfficeService } from '../backOffice/back-office.service';
import { OnlineTransactionService } from '../transactions/online-transaction.service';
import { TransactionEnumService } from '../transactions/transaction-enum.service';
import { DashboardService } from './dashboard.service';
import { FormControl } from '@angular/forms';
import { calendarService } from '../Activities/calendar/calendar.service';
import { EmailServiceService } from '../Email/email-service.service';
import { DatePipe } from '@angular/common';
import { AppConstants } from 'src/app/services/app-constants';
import { CustomerService } from '../../customers/component/customer/customer.service';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import { element } from 'protractor';
import {EnumDataService} from "../../../../services/enum-data.service";

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  apr: string;
  may: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Gross sales', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },
  { position: 'Redemptions', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },
  { position: 'Net sales', name: '5.23', weight: '5.45', symbol: '5.83', apr: '4.80', may: '5.08' },

];

export interface PeriodicElement2 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: 'Rahul Jain', name: 'Extend the account for an', weight: 'Nita Shinde' },
  { position: 'Mohan Kumar', name: 'Re-invest FD to goal', weight: 'Sajith Thilakan' },
  { position: 'Sagar Shah', name: 'Surrender insurance policy', weight: 'Khushboo Sidapara' },
  { position: 'Rahul Jain', name: 'File IT returns through CA', weight: 'Satish Patel' },

];

export interface PeriodicElement3 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Pending', name: '2', weight: '1', symbol: '4' },
  { position: 'Rejections', name: '2', weight: '3', symbol: '2' },


];

export interface PeriodicElement4 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { position: 'Pending', name: '2', weight: '1', symbol: '4' },
  { position: 'Rejections', name: '2', weight: '3', symbol: '2' },


];

export interface PeriodicElement5 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA5: PeriodicElement5[] = [
  { position: 'Vishnu Khandelwal	', name: 'SIP Rejection', weight: '23/04/2019' },
  {
    position: 'Saniya Kishore Parmar rep by Kishore Babulal Parmar	',
    name: 'Redemption Rejection',
    weight: '23/04/2019'
  },


];

export interface PeriodicElement6 {
  name: string;
  position: string;
  weight: string;
  symbol: string;

}

const ELEMENT_DATA6: PeriodicElement6[] = [
  { position: 'Mandira Gangakhedkar	', name: 'Investment Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },
  { position: 'Abhishek Mane	', name: 'Financial Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },
  { position: 'Sagar Shroff	', name: 'Tax Planning', weight: '1,00,000/Q', symbol: '15/09/2020' },


];

export interface PeriodicElement7 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  match: string;
  report: string;

}

const ELEMENT_DATA7: PeriodicElement7[] = [

  { position: 'CAMS	', name: 'INA000004409', weight: 'Today', symbol: 'Aniket Shah', match: '8', report: 'Report' },
  { position: 'Karvy	', name: 'INA000004409', weight: '1 day ago', symbol: 'System', match: '23', report: 'Report' },
  { position: 'FT	', name: 'INA000004409', weight: '10 days ago', symbol: 'Aniket Shah', match: '0', report: 'Report' },
  { position: 'CAMS	', name: 'INA000004409', weight: '2 days ago', symbol: 'System', match: '18', report: 'Report' },


];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  clientData: any;
  chartTotal: number;
  hasError: boolean;
  assetAllocationPieConfig: Chart;
  mfSubCategoryPieConfig: Chart;
  mfAllocationPieConfig: Chart;
  chart: Highcharts.Chart;
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
  ];
  todoListFlag: boolean;
  userData: any;
  constructor(
    public dialog: MatDialog, private subService: SubscriptionService,
    private eventService: EventService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private subInjectService: SubscriptionInject,
    private backoffice: BackOfficeService,
    private transactionService: OnlineTransactionService,
    private dashboardService: DashboardService,
    private calenderService: calendarService,
    private emailService: EmailServiceService,
    private utils: UtilService,
    private datePipe: DatePipe,
    private crmTaskService: CrmTaskService,
    private customerService: CustomerService,
    public enumDataService: EnumDataService
  ) {
    const date = new Date();
    const hourOfDay = date.getHours();
    if (hourOfDay < 12) {
      this.greeting = 'Good morning';
    } else if (hourOfDay < 16) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  documentSizeData: any = {};
  aumReconList: any;
  aumFlag: boolean;
  goalSummaryData: any;
  isKeyMatrix: boolean;
  subOverviewFlag: boolean;
  docOverviewFlag: boolean;
  isBirhtdayLoader: boolean;
  isLoading;
  isLoadingBirthdays;
  isGoalSummaryLoaderFlag: boolean;
  investmentAccountFlag: boolean;
  transactionFlag: boolean;
  showSummaryBar;
  taskStatusList: any;

  advisorId: any;
  dashBoardSummary: {}[];
  isLoadingSubSummary = false;
  feeRecieved: any;
  dataSourceClientWithSub: any;
  greeting: string;
  advisorName: any;
  parentId: any;
  sipCount: any;
  keyMetricJson: any = {
    mfAum: '',
    sipBook: '',
    clientCount: '',
    InvestorCount: ''
  };
  totalSales: any;
  finalStartDate: number;
  finalEndDate: number;
  transactionList: any;
  isRecentTransactionFlag: boolean;
  todoListData;
  eventData: any;
  portFolioData = [];
  formatedEvent: any[];
  calenderLoader: boolean;
  birthdayAnniList: any;
  connectedToGmail: boolean;
  excessAllow: any;
  dashEvent = true;
  bseData: {}[];
  nscData: {}[];
  last7DaysFlag: boolean;
  displayedDashboardSummary: string[] = ['name', 'service', 'amt', 'billing', 'icons'];
  subscriptionSummaryStatusFilter = '1';
  showInput = false;
  selectedItem = new FormControl();
  updateNote = new FormControl();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'apr', 'may'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['position', 'name', 'weight'];
  dataSource2 = new MatTableDataSource(ELEMENT_DATA2);
  displayedColumns3: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns4: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource4 = ELEMENT_DATA4;
  displayedColumns5: string[] = ['position', 'name', 'weight'];
  dataSource5 = ELEMENT_DATA5;
  displayedColumns6: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource6 = ELEMENT_DATA6;
  displayedColumns7: string[] = ['position', 'name', 'weight', 'symbol', 'match', 'report'];
  dataSource7 = ELEMENT_DATA7;

  sliderConfig = {
    slidesToShow: 1,
    infinite: true,
    variableWidth: true,
    outerEdgeLimit: true,
    nextArrow: '<div style=\'position: absolute; top: 35%; right: 0; cursor: pointer;\' class=\'nav-btn classNextArrow next-slide\'><img src=\'/assets/images/svg/next-arrow.svg\'></div>',
    prevArrow: '<div style=\'position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;\' class=\'nav-btn classNextArrow next-slide\'><img src=\'/assets/images/svg/pre-arrow.svg\'></div>',
  };


  sliderConfig_investment = {
    slidesToShow: 1,
    infinite: true,
    variableWidth: true,
    outerEdgeLimit: true,
    nextArrow: '<div style=\'position: absolute; top: 35%; right: 0; cursor: pointer;\' class=\'nav-btn classNextArrow next-slide\'><img src=\'/assets/images/svg/next-arrow.svg\'></div>',
    prevArrow: '<div style=\'position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;\' class=\'nav-btn classNextArrow next-slide\'><img src=\'/assets/images/svg/pre-arrow.svg\'></div>',
  };


  sliderConfig_transactions = {
    slidesToShow: 1,
    infinite: true,
    variableWidth: true,
    outerEdgeLimit: true,
    nextArrow: '<div style=\'position: absolute; top: 35%; right: 0; cursor: pointer;\' class=\'nav-btn classNextArrow next-slide\'><img src=\'/assets/images/svg/next-arrow.svg\'></div>',
    prevArrow: '<div style=\'position: absolute; top: 35%; left: -5px; z-index: 1; cursor: pointer;\' class=\'nav-btn classNextArrow next-slide\'><img src=\'/assets/images/svg/pre-arrow.svg\'></div>',
  };


  LastSevenDaysInvestmentAccounts: any;

  LastSevenDaysTransactions: any;
  rejectedFAILURE: any = [];
  lastSevenDays: any = new Date().setDate(new Date().getDate() - 7);
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
  ];

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
    this.advisorId = AuthService.getAdvisorId();
    this.parentId = AuthService.getAdminAdvisorId();
    this.clientData = AuthService.getClientData();
    this.advisorName = AuthService.getUserInfo().name;
    this.userData = AuthService.getUserInfo();
    this.excessAllow = localStorage.getItem('successStoringToken');
    this.getAssetAllocationData();
    this.getTotalRecivedByDash();
    this.clientWithSubscription();
    this.getSummaryDataDashboard(); // summry dashbord
    // this.sipCountGet();//for getting total sip book
    this.getKeyMetrics(); // for getting total AUM
    this.finalStartDate = UtilService.getStartOfTheDay(new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7)).getTime();
    this.finalEndDate = UtilService.getEndOfDay(new Date()).getTime();
    this.getTodoListData();
    this.getRecentTransactionData();
    this.initializePieChart();
    // this.connectAccountWithGoogle();
    this.getBirthdayOrAnniversary();
    this.getLast7DaysTransactionStatus();
    this.getDocumentTotalSize();
    this.getLastSevenDaysTransactions();
    this.getLatesAumReconciliationData();
    this.getLastSevenDaysInvestmentAccounts();
    this.getGoalSummaryData();
    this.initPointForTask();
    this.getMisData();

  }

  initPointForTask() {
    this.getTodaysTaskList();
  }

  getAssetAllocationData() {
    const obj = {
      clientId: 122326,
      advisorId: this.advisorId,
      targetDate: new Date().getTime()
    };
    this.tabsLoaded.portfolioData.isLoading = true;

    // this.loaderFn.increaseCounter();
    this.customerService.getAllFeedsPortFolio(obj).subscribe(res => {
      this.tabsLoaded.portfolioData.isLoading = false;
      if (res == null) {
        this.portFolioData = [];
        this.tabsLoaded.portfolioData.hasData = false;
      } else {
        this.tabsLoaded.portfolioData.hasData = true;
        const stock = res.find(d => d.assetType == 6);
        this.portFolioData = res;
        if (stock) {
          this.portFolioData = this.portFolioData.filter(d => d.assetType != 6);
          this.portFolioData.unshift(stock);
        }
        const chartData = [];
        let counter = 0;
        const othersData = {
          y: 0,
          name: 'Others',
          color: AppConstants.DONUT_CHART_COLORS[4],
          dataLabels: {
            enabled: false
          }
        };
        let chartTotal = 1;
        let hasNoDataCounter = res.length;
        const pieChartData = res.filter(element => element.assetType != 2 && element.currentValue != 0);
        pieChartData.forEach(element => {
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
              });
            } else {
              othersData.y += element.investedAmount;
            }
            counter++;
          } else {
            hasNoDataCounter--;
          }
        });
        chartTotal -= 1;
        if (chartTotal === 0) {
          this.chartTotal = 0;
          this.tabsLoaded.portfolioData.hasData = false;
        }
        if (counter > 4) {
          chartData.push(othersData);
        }
        if (counter > 0) {
          this.chartTotal = chartTotal;
          this.chartData = chartData;
          this.assetAllocationPieChartDataMgnt(this.chartData);
        }
      }
      this.tabsLoaded.portfolioData.isLoading = false;
      this.tabsLoaded.portfolioData.dataLoaded = true;
      // this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.tabsLoaded.portfolioData.isLoading = false;
      this.eventService.openSnackBar(err, 'Dismiss');
      // this.loaderFn.decreaseCounter();
    });
  }

  assetAllocationPieChartDataMgnt(data) {
    this.assetAllocationPieConfig.removeSeries(0);
    this.assetAllocationPieConfig.addSeries({
      type: 'pie',
      name: 'Asset allocation',
      animation: false,
      innerSize: '60%',
      data,
    }, true, true);
  }

  initializePieChart() {
    const chartConfig: any = {
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
    };
    this.assetAllocationPieConfig = new Chart(chartConfig);
    this.mfAllocationPieConfig = new Chart(chartConfig);
    this.mfSubCategoryPieConfig = new Chart(chartConfig);
    chartConfig.series = [{
      type: 'pie',
      animation: false,
      name: 'MF Asset allocation',
      innerSize: '60%',
      data: this.mfAllocationData
    }];
  }

  getTodaysTaskList() {
    this.isLoading = true;
    this.crmTaskService.getTaskStatusValues({})
      .subscribe(res => {
        if (res) {
          this.taskStatusList = res.taskStatus;

          this.getAllTaskList();
        }
      });
  }

  getTaskNameFromTaskStatusList(taskStatus) {
    return this.taskStatusList.find(item => item.id === taskStatus).name;
  }

  openAddTask(data) {
    // let popupHeaderText = !!data ? 'Edit Recurring deposit' : 'Add Recurring deposit';
    const fragmentData = {
      flag: 'addActivityTask',
      data,
      id: 1,
      state: 'open50',
      componentName: AddTasksComponent,
      // popupHeaderText: popupHeaderText,
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        console.log('this is sidebardata in subs subs : ', sideBarData);
        if (UtilService.isDialogClose(sideBarData)) {
          if (UtilService.isRefreshRequired(sideBarData)) {
            this.initPointForTask();
          }
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  getAllTaskList() {
    const data = {
      advisorId: this.advisorId,
      offset: 0,
      limit: -1,
      dateFilter: 1
    };
    this.crmTaskService.getAllTaskListValues(data)
      .subscribe(res => {
        this.isLoading = false;
        if (res) {
          console.log('this is some task values:::', res);
          const dataArray = [];
          res.forEach((element, index) => {
            const dateFormat = new Date(element.dueDate);
            const dueDate = dateFormat.getDate() + '/' + (dateFormat.getMonth() + 1) + '/' + dateFormat.getFullYear();
            dataArray.push({
              client: element.clientName,
              member: element.familyMemberName,
              des: element.description,
              cat: element.description,
              assigned: element.assignedToName,
              dueDate,
              dueDateTimeStamp: element.dueDate,
              taskStatus: this.getTaskNameFromTaskStatusList(element.status),
              id: element.id,
              advisorId: element.advisorId,
              clientId: element.clientId,
              familyMemberId: element.familyMemberId,
              assignedTo: element.assignedTo,
              taskTemplateId: element.taskTemplateId,
              categoryId: element.categoryId,
              subCategoryId: element.subCategoryId,
              subSubCategoryId: element.subSubCategoryId,
              adviceId: element.adviceId,
              adviceTypeId: element.adviceTypeId,
              linkedItemId: element.linkedItemId,
              status: element.status,
              completionDate: element.completionDate,
              commentsCount: element.commentsCount,
              totalSubTasks: element.totalSubTasks,
              subTaskCompleted: element.subTaskCompleted,
              subTasks: element.subTasks,
              collaborators: element.collaborators,
              attachments: element.attachments,
              comments: element.comments,
              menuList: '',
            });
          });
          this.dataSource2.data = dataArray;
        } else {
          this.dataSource2.data = null;
          // this.eventService.openSnackBar('No Task Found', 'DISMISS');
        }
      });
  }


  mailConnect(done) {
    this.excessAllow = done;
  }

  getLastSevenDaysInvestmentAccounts() {
    //  this.LastSevenDaysInvestmentAccounts = [{}, {}, {}]
    // this.investmentAccountFlag = true;
    const obj = {
      advisorId: this.advisorId,
      startDate: new Date().getTime(),
      endDate: new Date(this.lastSevenDays).getTime()
    };

    //       const obj = {
    //     "advisorId":5430,
    //     "startDate":1593369000000,
    //     "endDate":1594060199999
    //  }
    this.investmentAccountFlag = true;
    this.dashboardService.getLastSevenDaysInvestmentAccounts(obj).subscribe(
      (data) => {
        if (data) {
          this.investmentAccountFlag = false;
          this.LastSevenDaysInvestmentAccounts = data;
        } else {
          this.investmentAccountFlag = false;
          this.LastSevenDaysInvestmentAccounts = [];
        }
      },
      (err) => {
        this.investmentAccountFlag = false;
        this.LastSevenDaysInvestmentAccounts = [];

      });
  }

  getLastSevenDaysTransactions() {

    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: null,
      startDate: new Date().getTime(),
      endDate: new Date(this.lastSevenDays).getTime()
    };

    //    const obj = {
    //     "advisorId":5430,
    //     "tpUserCredentialId":null,
    //     "startDate":1593369000000,
    //     "endDate":1594060199999
    //  }
    this.transactionFlag = true;
    console.log(new Date(obj.startDate), new Date(obj.endDate), 'date 123');
    this.dashboardService.getLastSevenDaysTransactions(obj).subscribe(
      (data) => {
        console.log(data, 'LastSevenDaysTransactions 123');
        if (data) {
          this.transactionFlag = false;
          this.LastSevenDaysTransactions = data;
          this.dataSource5 = this.LastSevenDaysTransactions.filter((x) => {
            x.status == 1 || x.status == 7;
          });
        } else {
          this.transactionFlag = false;
          this.LastSevenDaysTransactions = [];
          this.dataSource5 = [];
        }
      });
  }

  getSummaryDataDashboard() {
    const obj = {
      advisorId: this.advisorId,
      limit: 9,
      offset: 0,
      dateType: 0,
      statusIdList: [this.subscriptionSummaryStatusFilter],
      fromDate: null,
      toDate: null

    };
    this.dashBoardSummary = [{}, {}, {}];
    this.isLoadingSubSummary = true;
    this.subService.filterSubscription(obj).subscribe(
      data => this.getSubSummaryRes(data), error => {
        this.isLoadingSubSummary = false;
        this.dataSource = [];

      }
    );
  }

  getTodoListData() {
    this.todoListFlag = true;
    const obj = {
      advisorId: this.advisorId
    };
    this.dashboardService.getNotes(obj).subscribe(
      data => {
        this.todoListFlag = false;
        if (data && data.length > 0) {
          data.forEach(element => {
            element.update = false;
            if (this.calculateDifferenc(element.createdOn) <= 1) {
              element.createdDate = this.calculateDifferenc(element.createdOn);
            } else {
              element.createdDate = this.datePipe.transform(element.createdOn, 'MMMM d, y');
            }
          });
          // data.forEach(element => {
          // });
          this.todoListData = data;
          // this.todoListData=this.todoListData.sort((a,b)=>a.due - b.due);
        } else {
          this.todoListData = undefined;
          this.todoListFlag = false;
        }
      }, err => {
        this.todoListData = undefined;
        this.todoListFlag = false;
      }
    );
  }

  addTodoList(value) {
    const obj = {
      id: 0,
      advisorId: this.advisorId,
      activityName: value
    };
    this.dashboardService.addNotes(obj).subscribe(
      data => {
        if (data) {
          this.eventService.openSnackBar('To-Do note is added', 'Dismiss');
          this.showInput = false;
          data.forEach(element => {
            element.update = false;
            this.selectedItem.reset();
            if (this.calculateDifferenc(element.createdOn) <= 1) {
              element.createdDate = this.calculateDifferenc(element.createdOn);
            } else {
              element.createdDate = this.datePipe.transform(element.createdOn, 'MMMM d, y');
            }
          });
          this.getTodoListData();
          this.todoListData = data;
          // this.todoListData.unshift(data);
        }
      }
    );
  }

  doubleClick(value) {
    value.update = true;
    this.updateNote.setValue(value.activityName);
  }

  focusOutFunction(value) {
    value.update = false;
  }

  updateTodoList(todoData) {
    const obj = {
      id: todoData.id,
      advisorId: this.advisorId,
      activityName: this.updateNote.value
    };
    this.dashboardService.updateNotes(obj).subscribe(
      data => {
        if (data) {
          this.eventService.openSnackBar('To-Do note is updated', 'Dismiss');
          this.showInput = false;
          data.forEach(element => {
            element.update = false;
            this.selectedItem.reset();
            if (this.calculateDifferenc(element.createdOn) <= 1) {
              element.createdDate = this.calculateDifferenc(element.createdOn);
            } else {
              element.createdDate = this.datePipe.transform(element.createdOn, 'MMMM d, y');
            }
          });
          this.getTodoListData();
          this.todoListData = data;
        }
      }), err => this.eventService.openSnackBar(err, 'Dismiss');
  }

  deleteTodoList(value, index) {
    this.dashboardService.deleteNotes(value.id).subscribe(
      data => {
        // if (data) {
        // this.todoListData.splice(index, 1);
        this.getTodoListData();
        // }
      }), err => {
        this.eventService.openSnackBar(err, 'Dismiss');
      };
  }


  getBirthdayOrAnniversary() {

    const toDate = new Date();
    toDate.setDate(new Date().getDate() + 7);
    const obj = {
      advisorId: this.advisorId,
      fromDate: new Date().getTime(),
      toDate: toDate.getTime()
    };
    this.isBirhtdayLoader = true;
    this.dashboardService.getBirthdayOrAnniversary(obj).subscribe(
      data => {
        if (data) {
          this.isBirhtdayLoader = false;
          data = data.filter(element => element.dateOfBirth && element.dateOfBirth != 0);
          data = this.sortDateWise(data);
          data.forEach(element => {
            if (element.displayName.length > 15) {
              element.shortName = element.displayName.substr(0, this.getPosition(element.displayName, ' ', 2));
            }
            if (element.dateOfBirth && element.dateOfBirth != 0) {
              element.daysToGo = this.calculateBirthdayOrAnniversary(element.dateOfBirth);
            }
          });
          this.utils.calculateAgeFromCurrentDate(data);
          this.birthdayAnniList = data;
          console.log(this.birthdayAnniList);
        } else {
          this.birthdayAnniList = [];
          this.isBirhtdayLoader = false;
        }
      },
      err => {
        this.birthdayAnniList = [];
        this.isBirhtdayLoader = false;
      }
    );
  }

  sortDateWise(data) {
    return data.sort((a: any, b: any) => {
      return new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
    });
  }

  getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }

  calculateBirthdayOrAnniversary(date) {
    let today, bday, diff, days;
    today = new Date().getDate();
    bday = new Date(date).getDate();
    days = bday - today;
    return days;
  }

  calculateDifferenc(createdDate) {
    const date1 = new Date(createdDate);
    const date2 = new Date();
    const diffDays = Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    console.log(Math.round(diffDays));
    return Math.round(diffDays);
  }

  getLast7DaysTransactionStatus() {
    this.last7DaysFlag = true;
    this.nscData = [{}, {}];
    this.bseData = [{}, {}];
    const obj = {
      advisorId: this.advisorId
    };
    this.dashboardService.last7DaysTransactionStatus(obj).subscribe(
      data => {
        if (data) {
          this.last7DaysFlag = false;
          this.nscData = data.nse;
          this.bseData = data.bse;
        } else {
          this.last7DaysFlag = false;
          this.nscData = [{}, {}];
          this.bseData = [{}, {}];
        }
      }, err => {
        this.last7DaysFlag = false;
        this.nscData = [{}, {}];
        this.bseData = [{}, {}];
      }
    );
  }

  getDocumentTotalSize() {
    this.docOverviewFlag = true;
    const obj = {
      advisorId: this.advisorId,
      // clientId
    };
    this.dashboardService.getDocumentTotalSize(obj).subscribe(
      data => {
        if (data) {
          this.docOverviewFlag = false;
          this.documentSizeData = data;
        }
      }
    );
  }

  getLatesAumReconciliationData() {
    this.aumReconList = [{}, {}, {}];
    this.aumFlag = true;
    const obj = {
      id: this.advisorId
    };
    this.dashboardService.getLatestAumReconciliation(obj).subscribe(
      data => {
        if (data) {
          console.log("this is aum recon list::", data);
          this.aumFlag = false;
          this.aumReconList = data;
        } else {
          this.aumFlag = false;
          this.aumReconList = [];
        }
      }, err => {
        this.aumFlag = false;
        this.aumReconList = [];
      }
    );
  }

  getGoalSummaryData() {
    this.isGoalSummaryLoaderFlag = true;
    const obj = {
      advisorId: this.advisorId
    };
    this.dashboardService.getGoalSummarydata(obj).subscribe(
      data => {
        if (data) {
          this.isGoalSummaryLoaderFlag = false;
          this.goalSummaryData = data;
        } else {

        }
      }, err => {

      }
    );
  }

  connectAccountWithGoogle() {
    this.calenderLoader = true;
    this.emailService.getProfile().subscribe(res => {
      if (res) {
        this.connectedToGmail = true;
        this.calenderLoader = false;
        localStorage.setItem('googleOAuthToken', 'oauthtoken');
        localStorage.setItem('successStoringToken', 'true');
        localStorage.setItem('associatedGoogleEmailId', AuthService.getUserInfo().userName);
        this.router.navigate(['/admin/emails/inbox'], { relativeTo: this.activatedRoute });
        this.getEvent();
      } else {
        this.calenderLoader = false;
        this.connectedToGmail = false;
        // this.eventService.ope(res, 'DISMISS');
      }
    }, err => {
      this.calenderLoader = false;
      this.connectedToGmail = false;
      // this.eventService.openSnackBarNoDuration(err, 'DISMISS');
    });
  }

  getEvent() {
    const eventData = {
      calendarId: AuthService.getUserInfo().userName,
      userId: AuthService.getUserInfo().advisorId
    };
    this.calenderService.getEvent(eventData).subscribe((data) => {

      if (data != undefined) {

        this.eventData = data;

        console.log(data, 'events calender', this.eventData);
        this.formatedEvent = [];

        for (const e of this.eventData) {
          if (e.start) {
            e.day = this.formateDate(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.month = this.formateMonth(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.year = this.formateYear(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.startTime = this.formateTime(!e.start.dateTime ? new Date(e.created) : new Date(e.start.dateTime));
            e.endTime = this.formateTime(!e.end.dateTime ? new Date(e.created) : new Date(e.end.dateTime));
            this.formatedEvent.push(e);
            // console.log(this.formatedEvent,"formatedEvent calender1",);
          }
        }
      }
    });


  }


  formateDate(date) {
    const dd = new Date(date).getDate();

    return dd;
  }

  formateMonth(date) {
    const mm = new Date(date).getMonth() + 1; // January is 0!
    return mm;
  }

  formateYear(date) {
    const yyyy = new Date(date).getFullYear();
    return yyyy;
  }

  formateTime(date) {

    let hh = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    let mm = date.getMinutes();
    const amPm = date.getHours() > 12 ? 'pm' : 'am';
    hh = hh < 10 ? '0' + hh : hh;
    mm = mm < 10 ? '0' + mm : mm;
    return hh + ':' + mm + amPm + ' ';
  }

  getRecentTransactionData() {
    this.isRecentTransactionFlag = true;
    const obj = {
      advisorId: this.advisorId,
      tpUserCredentialId: null,
      startDate: this.finalStartDate,
      endDate: this.finalEndDate
    };
    this.transactionService.getSearchScheme(obj).subscribe(
      data => {
        if (data) {
          this.isRecentTransactionFlag = false;
          this.transactionList = data;
          this.transactionList = TransactionEnumService.setPlatformEnum(data);
          this.transactionList = TransactionEnumService.setTransactionStatus(data);
        }
      },
      err => {
        this.eventService.openSnackBar(err, 'Dismefault/stockfeediss');
      }
    );
  }

  changeParentsTab(selectedTab) {
    this.eventService.tabData(selectedTab);
    if (selectedTab === 3) {
      this.router.navigate(['/admin/subscription/subscriptions']);

    } else if (selectedTab === 5) {
      this.router.navigate(['/admin/subscription/invoices']);
    }
  }

  getSubSummaryRes(data) {
    this.isLoadingSubSummary = false;
    // data.forEach(element => {
    //   element.feeMode = (element.feeMode == 1) ? 'FIXED' : 'VARIABLE';
    //   element.startsOn = (element.status == 1) ? 'START' : element.startsOn;
    //   element.status = (element.status == 1) ? 'NOT STARTED' : (element.status == 2) ?
    //   'LIVE' : (element.status == 3) ? 'FUTURE' : 'CANCELLED';
    // });
    if (data) {
      this.dashBoardSummary = data;
    } else {
      this.dashBoardSummary = [];
    }
  }

  Open(data) {
    let feeMode;
    data.isCreateSub = true;
    (data.subscriptionPricing.feeTypeId == 1) ? feeMode = FixedFeeComponent : feeMode = VariableFeeComponent;
    const fragmentData = {
      // flag: feeMode,
      data,
      id: 1,
      state: 'open',
      componentName: feeMode
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  openPlanSlider(value, state, data) {
    let componentName;
    // if (this.isLoading) {
    //   return
    // }
    (value == 'billerSettings') ? componentName = BillerSettingsComponent : (value == 'changePayee') ? componentName = ChangePayeeComponent :
      (value == 'SUBSCRIPTIONS') ? componentName = InvoiceHistoryComponent : (data.subscriptionPricing.feeTypeId == 1) ?
        value = 'createSubFixed' : value = 'createSubVariable';
    data.isCreateSub = false;
    const fragmentData = {
      flag: value,
      data,
      id: 1,
      state: 'open',
      componentName
    };
    const rightSideDataSub = this.subInjectService.changeNewRightSliderState(fragmentData).subscribe(
      sideBarData => {
        if (UtilService.isDialogClose(sideBarData)) {
          rightSideDataSub.unsubscribe();
        }
      }
    );
  }

  delete(data) {
    const Fragmentdata = {
      flag: data,
    };
    if (data === 'cancelSubscription') {
      const dialogRef = this.dialog.open(DeleteSubscriptionComponent, {
        width: '400px',
        // height:'40%',
        data: Fragmentdata,
        autoFocus: false,
      });
      /*dialogRef.afterClosed().subscribe(result => {
      });*/
    }
  }

  deleteModal(value) {
    const dialogData = {
      data: value,
      header: 'DELETE',
      body: 'Are you sure you want to delete the document?',
      body2: 'This cannot be undone.',
      btnYes: 'CANCEL',
      btnNo: 'DELETE'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
      autoFocus: false,

    });

    dialogRef.afterClosed().subscribe(result => {

    });

  }

  getTotalRecivedByDash() {
    // this.isLoading = true;
    const beginDate = new Date();
    beginDate.setMonth(beginDate.getMonth() - 1);
    const obj = {
      advisorId: this.advisorId,
      fromDate: UtilService.getStartOfTheDay(beginDate).getTime(),
      toDate: UtilService.getEndOfDay(new Date()).getTime()
    };
    this.subService.getTotalRecived(obj).subscribe(
      data => {
        this.totalSales = data != undefined ? data.totalSales : '0';
        this.feeRecieved = data != undefined ? data.feeRecieved : '0';
      }
    );
  }

  clientWithSubscription() {
    this.subOverviewFlag = true;
    const obj = {
      advisorId: this.advisorId
    };
    this.subService.clientWithSubcribe(obj).subscribe(
      data => {
        if (data) {
          this.subOverviewFlag = false;
          this.dataSourceClientWithSub = data;
        } else {
          this.subOverviewFlag = false;
          this.dataSourceClientWithSub = {};
        }
      }, err => {
        this.subOverviewFlag = false;
        this.dataSourceClientWithSub = {};
      }
    );
  }

  sipCountGet() {
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : [this.advisorId],
      arnRiaDetailsId: -1,
      parentId: this.parentId
    };
    this.backoffice.getSipcountGet(obj).subscribe(
      data => {
        this.sipCount = data.totalAmountInWords;
      },
      err => {
        this.sipCount = '';
      }
    );
  }

  getKeyMetrics() {
    this.isKeyMatrix = true;
    const obj = {
      id: this.advisorId
    };
    this.dashboardService.getKeyMetrics(obj).subscribe(
      data => {
        this.isKeyMatrix = false;
        this.keyMetricJson = data;
        this.keyMetricJson.mfAum = '';
      },
      err => {
        this.keyMetricJson = '';
      }
    );
  }

  openGuideDialog(): void {
    const dialogRef = this.dialog.open(DashboardGuideDialogComponent, {
      maxWidth: '100vw',
      width: '90vw',
      //height: '90vh',
      data: this.userData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getMisData() {
    const obj = {
      advisorId: (this.parentId == this.advisorId) ? 0 : this.advisorId,
      arnRiaDetailsId: -1,
      parentId: this.parentId
    };
    this.backoffice.getMisData(obj).subscribe(
      data => {
        if (data) {
          this.keyMetricJson.mfAum = data.totalAumRupees;
        }
        // UtilService.getNumberToWord(this.keyMetricJson.mfAum)
        // this.getFileResponseDataForMis(data)
      },
      err => {
        console.log('dashboard getMisData err : ', err);
      }
    );
  }


}
