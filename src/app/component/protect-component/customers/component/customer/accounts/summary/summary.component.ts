import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { isNumber } from 'util';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { element } from 'protractor';

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
  clientData: any;
  filterCashFlow;
  inflowFlag;
  outflowFlag;
  constructor(public eventService: EventService, private cusService: CustomerService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.clientData = AuthService.getClientData();
    this.asOnDate = new Date().getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.calculateTotalSummaryValues();
  }

  calculateTotalSummaryValues() {
    this.isLoading = true;
    console.log(new Date(this.asOnDate).getTime());
    const obj = {
      advisorId: this.advisorId,
      clientId: this.clientId,
      targetDate: this.asOnDate
    };
    this.cusService.calculateTotalValues(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.isLoading = false;
          console.log(data);
          this.totalAssets = 0;
          this.summaryTotalValue = Object.assign([], data);
          console.log(this.summaryTotalValue);
          let tempSummaryTotalValue: any = {}
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
            this.totalOfLiabilitiesAndTotalAssset(data);
          });
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
    this.cusService.getSUmmaryList(obj).subscribe(
      data => {
        console.log(data);
        this.calculate1DayAnd90Days(data);
        this.graphList = [];
        let sortedDateList = [];
        sortedDateList = data;
        sortedDateList.sort(function (a, b) {
          return a.targetDate - b.targetDate;
        })
        for (let singleData of sortedDateList) {
          let sumOf10Days = 0;
          singleData.summaryData.forEach(element => {
            if (element.assetType == 2) {
              sumOf10Days = sumOf10Days - element.currentValue;
            }
            else {
              sumOf10Days += element.currentValue;
            }
          });
          this.graphList.push([singleData.targetDate, sumOf10Days]);
        }
        this.lineChart('container');
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  getCashFlowList(obj) {
    this.cusService.getCashFlowList(obj).subscribe(
      data => {
        console.log(data);
        this.filterCashFlow = Object.assign({}, data);
        this.cashFlowViewDataSource = [];
        this.incomeList = [];
        this.expenseList = [];
        this.sortDataUsingFlowType(data, true);
        console.log(this.cashFlowViewDataSource);
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  sortDataUsingFlowType(ObjectArray, flag) {

    if (ObjectArray['expense'].length > 0 && ObjectArray['income'].length > 0) {
      this.cashFlowViewDataSource = ObjectArray['expense'];
      this.cashFlowViewDataSource = this.cashFlowViewDataSource.concat(ObjectArray['income']);
      ObjectArray['expense'].forEach(element => {
        element['colourFlag'] = false;
        this.expenseList.push(-Math.abs(element.currentValue))
      })
      ObjectArray['income'].forEach(element => {
        element['colourFlag'] = true;
        this.incomeList.push(element.currentValue)
      })
      this.inflowFlag = true;
      this.outflowFlag = true;
    }
    else if (ObjectArray['expense'].length > 0) {
      this.cashFlowViewDataSource = ObjectArray['expense'];
      ObjectArray['expense'].forEach(element => {
        element['colourFlag'] = false;
        this.expenseList.push(-Math.abs(element.currentValue))
      })
      this.outflowFlag = true;
    }
    else {
      this.cashFlowViewDataSource = ObjectArray['income'];
      ObjectArray['income'].forEach(element => {
        element['colourFlag'] = true;
        this.incomeList.push(element.currentValue)
      })
      this.inflowFlag = true;
    }
    this.cashFlow('cashFlow', ObjectArray);
  }


  filterData(eventData, flag) {
    this.incomeList = [];
    this.expenseList = [];
    if (this.inflowFlag && this.outflowFlag == false) {
      let ObjArray = {
        income: this.filterCashFlow.income,
        expense: []
      }
      this.sortDataUsingFlowType(ObjArray, true);
    }
    else if (this.outflowFlag && this.inflowFlag == false) {
      let ObjArray = {
        income: [],
        expense: this.filterCashFlow.expense
      }
      this.sortDataUsingFlowType(ObjArray, true);
    }
    else if (this.inflowFlag == false && this.outflowFlag == false) {
      (flag == 'inflow') ? this.outflowFlag = true : this.inflowFlag = true;
      let ObjArray = {
        income: (this.inflowFlag) ? this.filterCashFlow.income : [],
        expense: (this.outflowFlag) ? this.filterCashFlow.expense : []
      }
      this.sortDataUsingFlowType(ObjArray, true);
    }
    else {
      this.sortDataUsingFlowType(this.filterCashFlow, true);
    }
  }


  checkNumberPositiveAndNegative(value: number) {
    if (value == 0) {
      return undefined;
    }
    else {
      let result = Math.sign(value)
      return (result == -1) ? false : true;
    }
  }


  calculate1DayAnd90Days(data) {
    console.log(data)
    let firstIndexTotalCurrentValue = 0, lastIndexTotalCurrentValue = 0, secondLastIndexTotalCurrentValue = 0;
    if (data.length > 0) {
      data[0].summaryData.forEach(element => {                /////// first index total current value
        if (element.assetType != 2) {
          firstIndexTotalCurrentValue += element.currentValue;
        }
        else {
          firstIndexTotalCurrentValue -= element.currentValue;
        }
      });
      data[data.length - 1].summaryData.forEach(element => {   /////// last index total current value
        if (element.assetType != 2) {
          lastIndexTotalCurrentValue += element.currentValue;
        }
        else {
          lastIndexTotalCurrentValue -= element.currentValue;
        }
      });
      data[data.length - 2].summaryData.forEach(element => {       /////// second last index total current value
        if (element.assetType != 2) {
          secondLastIndexTotalCurrentValue += element.currentValue;
        }
        else {
          secondLastIndexTotalCurrentValue -= element.currentValue;
        }
      });
      this.nightyDayData = {
        value: lastIndexTotalCurrentValue - firstIndexTotalCurrentValue,
        flag: (Math.sign(lastIndexTotalCurrentValue - firstIndexTotalCurrentValue) == -1) ? false : true
      }
      this.oneDay = {
        value: lastIndexTotalCurrentValue - secondLastIndexTotalCurrentValue,
        flag: (Math.sign(lastIndexTotalCurrentValue - secondLastIndexTotalCurrentValue) == -1) ? false : true
      };
    }
  }


  totalOfLiabilitiesAndTotalAssset(dataList) {
    dataList.forEach(element => {
      if (element.assetType == 2) {
        this.liabilityTotal += element.currentValue;
      }
      else {
        this.totalAssetsWithoutLiability += element.currentValue;
      }
    });
  }

  dateChange(event) {
    this.asOnDate = new Date(event.value).getTime();
    this.calculateTotalSummaryValues();
  }


  cashFlow(id, data) {
    console.log(data);
    const { expense, income } = data;
    let timeArray = []
    if (expense.length > 0) {
      expense.forEach(element => {
        timeArray.push(this.datePipe.transform(new Date(element.targetDate), 'd MMM'))
      });
    }
    if (income.length > 0) {
      income.forEach(element => {
        timeArray.push(this.datePipe.transform(new Date(element.targetDate), 'd MMM'))
      });
    }

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
