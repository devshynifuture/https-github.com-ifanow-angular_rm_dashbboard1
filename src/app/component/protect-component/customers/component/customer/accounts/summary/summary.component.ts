import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { isNumber } from 'util';
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
  summaryMap: any = {};
  graphList: any[];
  totalAssetsWithoutLiability;
  liabilityTotal;
  nightyDayData: any;
  oneDay: any;

  constructor(public eventService: EventService, private cusService: CustomerService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.asOnDate = new Date().getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.cashFlow('cashFlow');
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
          this.summaryTotalValue.forEach(element => {
            this.summaryMap[element.assetType] = element;
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
          this.pieChart('piechartMutualFund', data);
        }
      },
      err => this.eventService.openSnackBar(err, 'Dismiss')
    );
    this.cusService.getSUmmaryList(obj).subscribe(
      data => {
        console.log(data);
        this.calculate1DayAnd90Days(data);
        this.graphList = [];
        for (let singleData of data) {
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

  cashFlow(id) {
    const chart1 = new Highcharts.Chart('cashFlow', {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: ['10', '20', '30', '40', '50']
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Inflow',
        color: '#5cc644',
        data: [5, 3, 4, 7, 2],
        type: undefined,
      }, {
        name: 'outFlow',
        color: '#ef6725',
        data: [2, -2, -3, 2, 1],
        type: undefined,
      }]
    });
  }

  lineChart(id) {
    const chart1 = new Highcharts.Chart('container', {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          '' : ''
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: ''
        }
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
        name: 'USD to EUR',
        data: this.graphList
      }]
    });
  }

  pieChart(id, data) {
    const dataSeriesList = [];
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
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
