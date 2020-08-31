import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventService} from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import {AuthService} from 'src/app/auth-service/authService';
import {CustomerService} from '../../customer.service';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {EnumServiceService} from 'src/app/services/enum-service.service';
import {UtilService} from 'src/app/services/util.service';
import {Chart} from 'angular-highcharts';
import {AppConstants} from 'src/app/services/app-constants';
import {ColorString} from "highcharts";

@Component({
  selector: 'app-portfolio-summary',
  templateUrl: './portfolio-summary.component.html',
  styleUrls: ['./portfolio-summary.component.scss']
})

export class PortfolioSummaryComponent implements OnInit, OnDestroy {
  advisorId: any;
  clientId: any;
  summaryTotalValue: any;
  isLoading: boolean;
  totalAssets: number;
  asOnDate: any;
  summaryMap;
  graphList: any[];
  totalAssetsWithoutLiability = 0;
  liabilityTotal = 0;
  nightyDayData: any;
  oneDay: any;
  displayedColumns: string[] = ['description', 'date', 'amount'];
  cashFlowViewDataSource = [];
  expenseList = [];
  incomeList = [];
  userData: any;
  filterCashFlow = {income: [], expense: []};
  inflowFlag;
  yearArr = Array(12).fill('').map((v, i) => this.datePipe.transform(new Date().setMonth(new Date().getMonth() + i), 'MMM'));
  tabsLoaded = {
    portfolioData: {
      dataLoaded: false,
      hasData: false,
      isLoading: true,
    }
  };
  assetAllocationPieConfig: Chart;
  portfolioGraph: Chart;

  chartTotal = 100;
  chartData: any[];
  portFolioData: any[] = [];
  hasError = false;
  clientData = AuthService.getClientData();
  outflowFlag;
  mutualFundValue: any = {
    currentValue: 0,
    percentage: 0
  };
  fixedIncome: any = {
    currentValue: 0,
    percentage: 0
  };
  realEstate: any = {
    currentValue: 0,
    percentage: 0
  };
  stocks: any = {
    currentValue: 0,
    percentage: 0
  };
  retirement: any = {
    currentValue: 0,
    percentage: 0
  };
  smallSavingScheme: any = {
    currentValue: 0,
    percentage: 0
  };
  cashAndFLow: any = {
    currentValue: 0,
    percentage: 0
  };
  Commodities: any =
    {
      currentValue: 0,
      percentage: 0
    };

  cashFlowFG: FormGroup;
  subscription = new Subscription();
  noCashflowData = false;

  finalTotal: number;
  cashflowFlag: boolean;
  letsideBarLoader: boolean;
  summaryFlag: boolean;
  allBanks: any[] = [];
  families: any[] = [];
  cashFlowDescNaming: any[] = [];
  assetAllocationRes: boolean;

  constructor(
    public eventService: EventService,
    private cusService: CustomerService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private enumService: EnumServiceService,
  ) {
  }

  ngOnInit() {
    this.cashFlowFG = this.fb.group({
      inflow: [true],
      outflow: [true],
      bankfilter: ['all'],
      familyfilter: ['all']
    });
    this.userData = AuthService.getUserInfo();
    this.asOnDate = new Date().getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    this.initializePieChart();
    this.initializePortfolioChart();
    this.calculateTotalSummaryValues();
    this.getAumGraphData();
    this.getAssetAllocationSummary();
    this.subscribeToCashflowChanges();
    this.cashFlowDescNaming = this.enumService.getAssetNamings();
  }

  subscribeToCashflowChanges() {
    this.cashFlowFG.valueChanges.subscribe(() => {
      this.filterCashflowData();
    });
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
  }

  initializePortfolioChart() {
    const chartConfig: any = {
      chart: {
        zoomType: 'x'
      },
      xAxis: {
        type: 'datetime',
        showEmpty: true
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          '' : ''
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            }, stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba') as ColorString],
            ]
          },
          /*fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              // [1,  Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              [1, Highcharts.getOptions().colors[0]],
            ]
          },*/
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      series: [{
        type: 'area',
        data: this.graphList
      }]
    };
    this.portfolioGraph = new Chart(chartConfig);
  }

  calculateTotalSummaryValues() {
    this.letsideBarLoader = true;
    console.log(new Date(this.asOnDate).getTime());
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      targetDate: this.asOnDate
    };
    this.cusService.calculateTotalValues(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.letsideBarLoader = false;
          console.log(data);
          this.totalAssets = 0;
          this.summaryTotalValue = Object.assign([], data);
          console.log(this.summaryTotalValue);
          this.liabilityTotal = 0;
          this.totalAssetsWithoutLiability = 0;
          this.totalOfLiabilitiesAndTotalAssset(this.summaryTotalValue);

          this.summaryTotalValue.forEach(element => {
            if (element.assetType == 2) {
              const dividedValue = element.currentValue / this.liabilityTotal;
              element.percentage = (dividedValue * 100).toFixed(2);
            } else if (!element.currentValue || element.currentValue == 0) {
              element.percentage = 0;
              element.currentValue = 0;
            } else {
              const dividedValue = element.currentValue / this.totalAssetsWithoutLiability;
              element.percentage = (dividedValue * 100).toFixed(2);
            }
          });
          // this.mutualFundValue = data[3];
          this.mutualFundValue = data.filter(element => element.assetType == 5);
          this.mutualFundValue = this.mutualFundValue[0];
          this.fixedIncome = data.filter(element => element.assetType == 7);
          this.fixedIncome = this.fixedIncome[0];
          this.realEstate = data.filter(element => element.assetType == 8);
          this.realEstate = this.realEstate[0];
          this.stocks = data.filter(element => element.assetType == 6);
          this.stocks = this.stocks[0];
          this.retirement = data.filter(element => element.assetType == 9);
          this.retirement = this.retirement[0];
          this.smallSavingScheme = data.filter(element => element.assetType == 10);
          this.smallSavingScheme = this.smallSavingScheme[0];
          this.cashAndFLow = data.filter(element => element.assetType == 31);
          this.cashAndFLow = this.cashAndFLow[0];
          this.Commodities = data.filter(element => element.assetType == 12);
          this.Commodities = this.Commodities[0];
          const tempSummaryTotalValue: any = {};

          this.letsideBarLoader = false;
          this.summaryMap = tempSummaryTotalValue;
          // this.pieChart('piechartMutualFund', this.summaryTotalValue);
        }
      },
      err => {
        this.letsideBarLoader = false;
        this.finalTotal = 0;
        this.liabilityTotal = 0;
        this.totalAssetsWithoutLiability = 0;
      }
    );
    // this.getSummaryList(obj);
    this.getCashFlowList(obj);
  }

  getAssetAllocationSummary() {
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      targetDate: this.asOnDate
    };
    this.tabsLoaded.portfolioData.isLoading = true;
    this.cusService.getAssetAllocationSummary(obj).subscribe(
      res => {
        if (res == null) {
          this.assetAllocationRes = false;
          this.portFolioData = [];
          this.tabsLoaded.portfolioData.hasData = false;
        } else {
          this.assetAllocationRes = true;
          this.tabsLoaded.portfolioData.hasData = true;
          // let stock = res.find(d => d.assetType == 6);
          // this.portFolioData = res;
          // if (stock) {
          //   this.portFolioData = this.portFolioData.filter(d => d.assetType != 6);
          //   this.portFolioData.unshift(stock);
          // }

          let chartData = [];
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
          const pieChartData = res;
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
                });
              } else {
                othersData.y += element.currentValue;
              }
              counter++;
            } else {
              hasNoDataCounter--;
            }
          });
          if (chartData) {
            let index;
            let obj = {};
            chartData = this.sorting(chartData, 'name');
            chartData.forEach((element, ind) => {
              if (element.name == 'Others') {
                index = ind;
              }
            });
            if (index) {
              obj = chartData.splice(index, 1);
              const outputObj = obj[0];
              chartData.push(outputObj);
            }
          }
          chartTotal -= 1;
          if (chartTotal === 0) {
            this.assetAllocationRes = false;
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

      },
      err => {
        this.hasError = true;
        this.assetAllocationRes = false;
        this.tabsLoaded.portfolioData.isLoading = false;
        this.eventService.openSnackBar(err, 'Dismiss');
      }
    );
  }

  sorting(data, filterId) {
    if (data) {
      data.sort((a, b) =>
        a[filterId] > b[filterId] ? 1 : (a[filterId] === b[filterId] ? 0 : -1)
      );
    }


    return data;
  }

  getAumGraphData() {
    this.summaryFlag = true;
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      targetDate: this.asOnDate
    };
    this.cusService.getAumGraphData(obj).subscribe(
      data => {
        console.log('getAumGraphData data', data);
        this.summaryFlag = false;
        this.graphList = [];
        let sortedDateList = [];
        sortedDateList = data;
        sortedDateList.sort((a, b) => {
          return a.targetDate - b.targetDate;
        });
        this.calculate1DayAnd90Days(sortedDateList);
        for (const singleData of sortedDateList) {
          this.graphList.push([singleData.targetDate, Math.round(singleData.currentValue)]);
        }
        this.setPortfolioGraphData(this.graphList);
        // this.lineChart('container-hc-figure');
      },
      err => {
        this.finalTotal = 0;
      }
    );
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

  setPortfolioGraphData(data) {
    this.portfolioGraph.removeSeries(0);
    this.portfolioGraph.addSeries({
      type: 'area',
      data: this.graphList
    }, true, true);
  }

  getCashFlowList(obj) {
    this.cashflowFlag = true;
    this.cashFlowViewDataSource = [{}, {}, {}];
    this.cusService.getCashFlowList(obj).subscribe(
      data => {
        this.cashflowFlag = false;
        this.filterCashFlow = Object.assign({}, data);
        this.cashFlowViewDataSource = [];
        if (data.income.length === 0 && data.expense.length === 0) {
          this.noCashflowData = true;
        }
        this.incomeList = [];
        this.expenseList = [];
        this.createFilterList();
        this.sortDataUsingFlowType(data);
      },
      err => {
        this.cashFlowViewDataSource = [];
        this.noCashflowData = true;
      }
    );
  }

  sortDataUsingFlowType(ObjectArray) {
    this.inflowFlag = false;
    this.outflowFlag = false;

    if (ObjectArray.expense.length > 0 && ObjectArray.income.length > 0) {
      this.cashFlowViewDataSource = ObjectArray.expense;
      this.cashFlowViewDataSource = this.cashFlowViewDataSource.concat(ObjectArray.income);
      ObjectArray.expense.forEach(element => {
        element.colourFlag = false;
        this.expenseList.push(-Math.abs(Math.round(element.currentValue)));
        this.expenseList.push(0);
      });
      ObjectArray.income.forEach(element => {
        element.colourFlag = true;
        this.incomeList.push(Math.round(element.currentValue));
        this.incomeList.push(0);
      });
      this.inflowFlag = true;
      this.outflowFlag = true;
    } else if (ObjectArray.expense.length > 0) {
      this.cashFlowViewDataSource = ObjectArray.expense;
      ObjectArray.expense.forEach(element => {
        element.colourFlag = false;
        this.expenseList.push(Math.abs(Math.round(element.currentValue)));
      });
      this.outflowFlag = true;
    } else if (ObjectArray.income.length > 0) {
      this.cashFlowViewDataSource = ObjectArray.income;
      ObjectArray.income.forEach(element => {
        element.colourFlag = true;
        this.incomeList.push(Math.round(element.currentValue));
      });
      this.inflowFlag = true;
    } else {
      this.cashFlowViewDataSource = [];
    }
    this.cashFlow('cashFlow', ObjectArray);
  }

  createFilterList() {
    this.allBanks = [];
    const cashflows = [...this.filterCashFlow.expense, ...this.filterCashFlow.income];

    const banks = [...new Set(cashflows.map(flow => flow.userBankMappingId))];
    this.allBanks = banks.map(bank => {
      const tnx = cashflows.find(tnx => tnx.userBankMappingId === bank);
      const bankObj = {
        name: tnx.bankName,
        id: bank
      };
      // non linked bank id is 0
      if (bank === 0) {
        bankObj.name = 'Non-linked banks';
      }
      return bankObj;
    });

    const families = [...new Set(cashflows.map(flow => flow.familyMemberId))];
    this.families = families.map(family => {
      const tnx = cashflows.find(tnx => tnx.familyMemberId === family);
      const bankObj = {
        name: tnx.ownerName,
        id: family
      };
      return bankObj;
    });
  }


  filterCashflowData() {
    this.incomeList = [];
    this.expenseList = [];

    let cashflows = [...this.filterCashFlow.expense, ...this.filterCashFlow.income];

    if (this.cashFlowFG.controls.bankfilter.value != 'all') {
      cashflows = cashflows.filter(flow => flow.userBankMappingId === this.cashFlowFG.controls.bankfilter.value);
    }

    if (this.cashFlowFG.controls.familyfilter.value != 'all') {
      cashflows = cashflows.filter(flow => flow.familyMemberId === this.cashFlowFG.controls.familyfilter.value);
    }

    const cashflowObj = {
      income: [],
      expense: []
    };
    if (this.cashFlowFG.controls.inflow.value) {
      cashflowObj.income = cashflows.filter(flow => flow.inputOutputFlag === 1);
    }

    if (this.cashFlowFG.controls.outflow.value) {
      cashflowObj.expense = cashflows.filter(flow => flow.inputOutputFlag === -1);
    }

    this.sortDataUsingFlowType(cashflowObj);
  }

  checkNumberPositiveAndNegative(value: number) {
    return undefined;

    /* if (value == 0) {
       return undefined;
     } else {
       const result = Math.sign(value);
       return (result == -1) ? false : true;
     }*/
  }


  calculate1DayAnd90Days(data) {
    console.log(data);
    let firstIndexTotalCurrentValue = 0, lastIndexTotalCurrentValue = 0, secondLastIndexTotalCurrentValue = 0;
    if (data.length > 0) {
      firstIndexTotalCurrentValue = data[0].currentValue;
      lastIndexTotalCurrentValue = data[data.length - 1].currentValue;
      secondLastIndexTotalCurrentValue = data[data.length - 2].currentValue;
      this.nightyDayData = {
        value: lastIndexTotalCurrentValue - firstIndexTotalCurrentValue,
        flag: (Math.sign(lastIndexTotalCurrentValue - firstIndexTotalCurrentValue) == -1) ? false : true
      };
      this.oneDay = {
        value: Math.abs(lastIndexTotalCurrentValue - secondLastIndexTotalCurrentValue),
        flag: (Math.sign(lastIndexTotalCurrentValue - secondLastIndexTotalCurrentValue) == -1) ? false : true
      };
    }
  }


  totalOfLiabilitiesAndTotalAssset(dataList) {
    dataList.forEach(element => {
      if (element.assetType == 2) {
        this.liabilityTotal += element.currentValue;
      } else {
        this.totalAssetsWithoutLiability += element.currentValue;
      }
    });
    console.log(this.totalAssetsWithoutLiability, 'total asset without liability');
    console.log(this.liabilityTotal, 'liability total');
    this.finalTotal = this.totalAssetsWithoutLiability - this.liabilityTotal;
  }

  dateChange(event) {
    this.asOnDate = new Date(event.value).getTime();
    this.getAumGraphData();
    this.calculateTotalSummaryValues();
    this.getAssetAllocationSummary();
  }

  cashFlow(id, data) {
    console.log(data);
    const thisMonthStart = UtilService.getStartOfTheDay(new Date(new Date().setDate(1)));
    const thisMonthEnd = UtilService.getEndOfDay(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    const {income, expense} = data;
    income.forEach(element => {
      element.month = this.datePipe.transform(new Date(element.targetDate), 'MMM');
    });
    expense.forEach(element => {
      element.month = this.datePipe.transform(new Date(element.targetDate), 'MMM');
    });

    const incomeGraph = this.yearArr.map((month, i) => {
      return income.filter(e => e.month == month)
        .map(e => e.currentValue)
        .reduce((acc, curr) => acc + curr, 0);
    });

    const expenseGraph = this.yearArr.map((month, i) => {
      return expense.filter(e => e.month == month)
        .map(e => e.currentValue)
        .reduce((acc, curr) => acc + curr, 0);
    });

    new Highcharts.Chart('cashFlow', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: this.yearArr,
        visible: true
      },
      yAxis: {
        visible: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Income',
        color: '#5cc644',
        data: incomeGraph,
        showInLegend: false,
        type: 'column',
      }, {
        name: 'Expense',
        color: '#ef6725',
        data: expenseGraph,
        showInLegend: false,
        type: 'column',
      }]
    });
  }

  lineChart(id) {
    // const chart1 = new Highcharts.Chart(id, );
  }

  pieChart(id, data) {
    const dataSeriesList = [];
    let totalValue = 0;
    // data = data.filter(element => {
    //   totalValue += element.currentValue;
    //   return element.assetType != 2;
    // });
    data = data.filter(element => {
      totalValue += element.currentValue;
      return element.currentValue != 0;
    });
    // data.forEach(element => {
    //   totalValue += element.currentValue;
    // });
    data.forEach(element => {
      // const totalAssetData = totalValue;
      const dividedValue = element.currentValue / totalValue;
      dataSeriesList.push({
        name: element.assetTypeString,
        y: dividedValue * 100,
        // color: "#A6CEE3",
        dataLabels: {
          enabled: false
        }
      });
    });
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
        pointFormat: '<b>{point.percentage:.1f}%</b>'
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
          size: '85%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        data: dataSeriesList
      }]
    });
  }

  getShortForm(elem) {
    const name = this.cashFlowDescNaming.find(asset => asset.assetType === elem.assetType);
    if (name) {
      return name.assetShortName;
    }
    return '';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
