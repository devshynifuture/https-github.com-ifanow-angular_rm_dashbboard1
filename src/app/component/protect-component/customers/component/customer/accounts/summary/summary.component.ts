import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})

export class SummaryComponent implements OnInit {
  advisorId: any;
  clientId: any;
  summaryTotalValue: any;
  isLoading: boolean;
  totalAssets: number;
  asOnDate: any;
  summaryMap;
  graphList: any[];
  totalAssetsWithoutLiability;
  liabilityTotal;
  nightyDayData: any;
  oneDay: any;
  displayedColumns: string[] = ['description', 'date', 'amount'];
  cashFlowViewDataSource = [];
  expenseList = [];
  incomeList = [];
  userData: any;
  filterCashFlow = { income: [], expense: [] };
  inflowFlag;
  outflowFlag;
  mutualFundValue: any = {
    currentValue: null,
    percentage: null
  };
  fixedIncome: any = {
    currentValue: null,
    percentage: null
  };
  realEstate: any = {
    currentValue: null,
    percentage: null
  };
  stocks: any = {
    currentValue: null,
    percentage: null
  };
  retirement: any = {
    currentValue: null,
    percentage: null
  };
  smallSavingScheme: any = {
    currentValue: null,
    percentage: null
  };
  cashAndFLow: any = {
    currentValue: null,
    percentage: null
  };
  Commodities: any =
    {
      currentValue: null,
      percentage: null
    }
  bscData: any;
  nscDAta: any;
  nscData: any;
  summaryFlag: boolean;
  cashflowFlag: boolean;
  StockFeedFlag: boolean;
  letsideBarLoader: boolean;
  selectedVal: string;
  goldData: any;
  silverData: any;
  nifty500Data: any;
  deptData;
  constructor(public eventService: EventService, private cusService: CustomerService,
    private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.userData = AuthService.getUserInfo();
    this.asOnDate = new Date().getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    this.calculateTotalSummaryValues();
  }

  calculateTotalSummaryValues() {
    this.mutualFundValue = {
      currentValue: null,
      percentage: null
    }
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
          this.mutualFundValue = data[3];
          this.fixedIncome = data[0];
          this.realEstate = data[1];
          this.stocks = data[2];
          this.retirement = data[4];
          this.smallSavingScheme = data[5];
          this.cashAndFLow = data[6];
          this.Commodities = data[7];
          const tempSummaryTotalValue: any = {};
          this.summaryTotalValue.forEach(element => {
            tempSummaryTotalValue[element.assetType] = element;
            if (element.currentValue == element.investedAmount) {
              element.percentage = 0;
            } else {
              const topValue = element.currentValue - element.investedAmount;
              const dividedValue = topValue / element.investedAmount;
              element.percentage = (dividedValue * 100).toFixed(2);
              element.positiveFlag = (Math.sign(element.percentage) == 1) ? true : false;
            }
            this.totalAssetsWithoutLiability = 0;
            this.liabilityTotal = 0;
          });
          this.totalOfLiabilitiesAndTotalAssset(data);
          this.letsideBarLoader = false;
          this.summaryMap = tempSummaryTotalValue;
          this.pieChart('piechartMutualFund', data);
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
    this.getSummaryList(obj);
    this.getCashFlowList(obj);
  }

  getSummaryList(obj) {
    this.summaryFlag = true;
    this.cusService.getSUmmaryList(obj).subscribe(
      data => {
        console.log(data);
        this.summaryFlag = false;
        this.graphList = [];
        let sortedDateList = [];
        sortedDateList = data;
        sortedDateList.sort(function (a, b) {
          return a.targetDate - b.targetDate;
        });
        this.calculate1DayAnd90Days(sortedDateList);
        for (const singleData of sortedDateList) {
          let sumOf10Days = 0;
          singleData.summaryData.forEach(element => {
            if (element.assetType == 2) {
              sumOf10Days = sumOf10Days - element.currentValue;
            } else {
              sumOf10Days += element.currentValue;
            }
          });
          this.graphList.push([singleData.targetDate, Math.round(sumOf10Days)]);
        }
        this.lineChart('container');
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  getCashFlowList(obj) {
    this.cashflowFlag = true;
    this.cashFlowViewDataSource = [{}, {}, {}];
    this.cusService.getCashFlowList(obj).subscribe(
      data => {
        this.cashflowFlag = false;
        console.log(data);
        this.filterCashFlow = Object.assign({}, data);
        this.cashFlowViewDataSource = [];
        this.incomeList = [];
        this.expenseList = [];
        this.sortDataUsingFlowType(data, true);
        console.log(this.cashFlowViewDataSource);
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
  }

  sortDataUsingFlowType(ObjectArray, flag) {

    if (ObjectArray['expense'].length > 0 && ObjectArray['income'].length > 0) {
      this.cashFlowViewDataSource = ObjectArray['expense'];
      this.cashFlowViewDataSource = this.cashFlowViewDataSource.concat(ObjectArray['income']);
      ObjectArray['expense'].forEach(element => {
        element['colourFlag'] = false;
        this.expenseList.push(-Math.abs(Math.round(element.currentValue)));
        this.expenseList.push(0);
      });
      ObjectArray['income'].forEach(element => {
        element['colourFlag'] = true;
        this.incomeList.push(Math.round(element.currentValue));
        this.incomeList.push(0);
      });
      this.inflowFlag = true;
      this.outflowFlag = true;
    } else if (ObjectArray['expense'].length > 0) {
      this.cashFlowViewDataSource = ObjectArray['expense'];
      ObjectArray['expense'].forEach(element => {
        element['colourFlag'] = false;
        this.expenseList.push(-Math.abs(Math.round(element.currentValue)));
      });
      this.outflowFlag = true;
    } else {
      this.cashFlowViewDataSource = ObjectArray['income'];
      ObjectArray['income'].forEach(element => {
        element['colourFlag'] = true;
        this.incomeList.push(Math.round(element.currentValue));
      });
      this.inflowFlag = true;
    }
    this.cashFlow('cashFlow', ObjectArray);
  }


  filterData(eventData, flag) {
    this.incomeList = [];
    this.expenseList = [];
    if (this.inflowFlag && this.outflowFlag == false) {
      const ObjArray = {
        income: this.filterCashFlow.income,
        expense: []
      };
      this.sortDataUsingFlowType(ObjArray, true);
    } else if (this.outflowFlag && this.inflowFlag == false) {
      const ObjArray = {
        income: [],
        expense: this.filterCashFlow.expense
      };
      this.sortDataUsingFlowType(ObjArray, true);
    } else if (this.inflowFlag == false && this.outflowFlag == false) {
      (flag == 'inflow') ? this.outflowFlag = true : this.inflowFlag = true;
      const ObjArray = {
        income: (this.inflowFlag) ? this.filterCashFlow.income : [],
        expense: (this.outflowFlag) ? this.filterCashFlow.expense : []
      };
      this.sortDataUsingFlowType(ObjArray, true);
    } else {
      this.sortDataUsingFlowType(this.filterCashFlow, true);
    }
  }


  checkNumberPositiveAndNegative(value: number) {
    if (value == 0) {
      return undefined;
    } else {
      const result = Math.sign(value);
      return (result == -1) ? false : true;
    }
  }


  calculate1DayAnd90Days(data) {
    console.log(data);
    let firstIndexTotalCurrentValue = 0, lastIndexTotalCurrentValue = 0, secondLastIndexTotalCurrentValue = 0;
    if (data.length > 0) {
      data[0].summaryData.forEach(element => {                /////// first index total current value
        if (element.assetType != 2) {
          firstIndexTotalCurrentValue += element.currentValue;
        } else {
          firstIndexTotalCurrentValue -= element.currentValue;
        }
      });
      data[data.length - 1].summaryData.forEach(element => {   /////// last index total current value
        if (element.assetType != 2) {
          lastIndexTotalCurrentValue += element.currentValue;
        } else {
          lastIndexTotalCurrentValue -= element.currentValue;
        }
      });
      data[data.length - 2].summaryData.forEach(element => {       /////// second last index total current value
        if (element.assetType != 2) {
          secondLastIndexTotalCurrentValue += element.currentValue;
        } else {
          secondLastIndexTotalCurrentValue -= element.currentValue;
        }
      });
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
  }

  dateChange(event) {
    this.asOnDate = new Date(event.value).getTime();
    this.calculateTotalSummaryValues();
  }

  cashFlow(id, data) {
    console.log(data);
    const { expense, income } = data;
    const timeArray = [];

    if (income.length > 0) {
      income.forEach(element => {
        timeArray.push(this.datePipe.transform(new Date(element.targetDate), 'd MMM'));
      });
    }
    if (expense.length > 0) {
      expense.forEach(element => {
        timeArray.push(this.datePipe.transform(new Date(element.targetDate), 'd MMM'));
      });
    }
    console.log('timearray : ', timeArray);
    const chart1 = new Highcharts.Chart('cashFlow', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: timeArray
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Income',
        color: '#5cc644',
        data: this.incomeList,
        type: undefined,
      }, {
        name: 'Expense',
        color: '#ef6725',
        data: this.expenseList,
        type: undefined,
      }]
    });
  }

  lineChart(id) {
    const chart1 = new Highcharts.Chart('container', {
      chart: {
        zoomType: 'x'
      },
      xAxis: {
        type: 'datetime'
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
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              // [1,  Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
              [1, Highcharts.getOptions().colors[0]],
            ]
          },
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
    });
  }

  pieChart(id, data) {
    const dataSeriesList = [];
    data = data.filter(element => element.assetType != 2);
    data = data.filter(element => element.currentValue != 0);
    data.forEach(element => {
      const totalAssetData = this.totalAssetsWithoutLiability + this.liabilityTotal;
      const dividedValue = element.currentValue / totalAssetData;
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
}
