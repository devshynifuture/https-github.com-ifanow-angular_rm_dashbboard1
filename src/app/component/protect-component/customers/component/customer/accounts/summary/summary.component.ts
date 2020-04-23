import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(public eventService: EventService, private cusService: CustomerService, private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.asOnDate = new Date().getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.pieChart('piechartMutualFund');
    this.lineChart('container');
    this.cashFlow('cashFlow');
    this.calculateTotalSummaryValues();
  }
  calculateTotalSummaryValues() {
    this.isLoading = true;
    console.log(new Date(this.asOnDate).getTime())
    let obj =
    {
      advisorId: this.advisorId,
      clientId: this.clientId,
      targetDate: this.asOnDate
    }
    this.cusService.calculateTotalValues(obj).subscribe(
      data => {
        if (data && data.length > 0) {
          this.isLoading = false;
          console.log(data);
          this.totalAssets = 0;
          this.summaryTotalValue = Object.assign([], data);
          console.log(this.summaryTotalValue)
          this.summaryTotalValue.forEach(element => {
            if (element.currentValue == 0) {
              element['currentValue'] = '-';
              element['percentage'] = '-';
            }
            else if (element.currentValue == element.investedAmount) {
              element['percentage'] = 0;
            }
            else {
              let topValue = element.currentValue - element.investedAmount;
              let dividedValue = topValue / element.investedAmount;
              element['percentage'] = (dividedValue * 100).toFixed(2);
              element['positiveFlag'] = (Math.sign(element.percentage) == 1) ? true : false;
            }
            if (isNumber(element.currentValue)) {
              this.totalAssets += element.currentValue;
            }
          });
        }
      },
      err => this.eventService.openSnackBar(err, "Dismiss")
    )
  }
  dateChange(event) {
    this.asOnDate = new Date(event.value).getTime();
    this.calculateTotalSummaryValues();
  }
  cashFlow(id) {
    var chart1 = new Highcharts.Chart('cashFlow', {
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
    var chart1 = new Highcharts.Chart('container', {
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
        data: [
          [
            1167609600000,
            0.7537
          ],
          [
            1167696000000,
            0.7537
          ],
          [
            1167782400000,
            0.7559
          ],
          [
            1167868800000,
            0.7631
          ],
          [
            1167955200000,
            0.7644
          ],
          [
            1168214400000,
            0.769
          ],
          [
            1168300800000,
            0.7683
          ],
          [
            1168387200000,
            0.77
          ],
          [
            1168473600000,
            0.7703
          ],
          [
            1168560000000,
            0.7757
          ],
          [
            1168819200000,
            0.7728
          ],
          [
            1168905600000,
            0.7721
          ],
          [
            1168992000000,
            0.7748
          ],
          [
            1169078400000,
            0.774
          ],
          [
            1169164800000,
            0.7718
          ],
          [
            1169424000000,
            0.7731
          ],
          [
            1169510400000,
            0.767
          ],
          [
            1169596800000,
            0.769
          ],
          [
            1169683200000,
            0.7706
          ],
          [
            1169769600000,
            0.7752
          ],
          [
            1170028800000,
            0.774
          ],
          [
            1170115200000,
            0.771
          ],
          [
            1170201600000,
            0.7721
          ],
          [
            1170288000000,
            0.7681
          ],
          [
            1170374400000,
            0.7681
          ],
          [
            1170633600000,
            0.7738
          ],
          [
            1170720000000,
            0.772
          ],
          [
            1170806400000,
            0.7701
          ],
          [
            1170892800000,
            0.7699
          ],
          [
            1170979200000,
            0.7689
          ],
          [
            1171238400000,
            0.7719
          ],
          [
            1171324800000,
            0.768
          ],
          [
            1171411200000,
            0.7645
          ],
          [
            1171497600000,
            0.7613
          ],
          [
            1171584000000,
            0.7624
          ],
          [
            1171843200000,
            0.7616
          ],
          [
            1171929600000,
            0.7608
          ],
          [
            1172016000000,
            0.7608
          ],
          [
            1172102400000,
            0.7631
          ],
          [
            1172188800000,
            0.7615
          ],
          [
            1172448000000,
            0.76
          ],
          [
            1172534400000,
            0.756
          ],
          [
            1172620800000,
            0.757
          ],
          [
            1172707200000,
            0.7562
          ],
          [
            1172793600000,
            0.7598
          ],
          [
            1173052800000,
            0.7645
          ],
          [
            1173139200000,
            0.7635
          ],
          [
            1173225600000,
            0.7614
          ],
          [
            1173312000000,
            0.7604
          ],
          [
            1173398400000,
            0.7603
          ],
          [
            1173657600000,
            0.7602
          ],
          [
            1173744000000,
            0.7566
          ],
          [
            1173830400000,
            0.7587
          ],
          [
            1173916800000,
            0.7562
          ],
          [
            1174003200000,
            0.7506
          ],
          [
            1174262400000,
            0.7518
          ],
          [
            1174348800000,
            0.7522
          ],
          [
            1174435200000,
            0.7524
          ],
          [
            1174521600000,
            0.7491
          ],
          [
            1174608000000,
            0.7505
          ],
          [
            1174867200000,
            0.754
          ],
          [
            1174953600000,
            0.7493
          ],
          [
            1175040000000,
            0.7493
          ],
          [
            1175126400000,
            0.7491
          ],
          [
            1175212800000,
            0.751
          ],
          [
            1175472000000,
            0.7483
          ],
          [
            1175558400000,
            0.7487
          ],
          [
            1175644800000,
            0.7491
          ],
          [
            1175731200000,
            0.7479
          ],
          [
            1175817600000,
            0.7479
          ],
          [
            1176076800000,
            0.7479
          ],
          [
            1176163200000,
            0.7449
          ],
          [
            1176249600000,
            0.7454
          ],
          [
            1176336000000,
            0.7427
          ],
          [
            1176422400000,
            0.7391
          ],
          [
            1176681600000,
            0.7381
          ],
          [
            1176768000000,
            0.7382
          ],
          [
            1176854400000,
            0.7366
          ],
          [
            1176940800000,
            0.7353
          ],
          [
            1177027200000,
            0.7351
          ],
          [
            1177286400000,
            0.7377
          ],
          [
            1177372800000,
            0.7364
          ],
          [
            1177459200000,
            0.7328
          ],
          [
            1177545600000,
            0.7356
          ],
          [
            1177632000000,
            0.7331
          ],
          [
            1177891200000,
            0.7351
          ],
          [
            1177977600000,
            0.7351
          ],
          [
            1178064000000,
            0.736
          ],
          [
            1178150400000,
            0.7347
          ],
          [
            1178236800000,
            0.7375
          ],
          [
            1178496000000,
            0.7346
          ],
          [
            1178582400000,
            0.7377
          ],
          [
            1178668800000,
            0.7389
          ],
          [
            1178755200000,
            0.7394
          ],
          [
            1178841600000,
            0.7416
          ],
          [
            1179100800000,
            0.7382
          ],
          [
            1179187200000,
            0.7388
          ],
          [
            1179273600000,
            0.7368
          ],
          [
            1179360000000,
            0.74
          ],
          [
            1179446400000,
            0.7421
          ],
          [
            1179705600000,
            0.7439
          ],
          [
            1179792000000,
            0.7434
          ],
          [
            1179878400000,
            0.7414
          ],
          [
            1179964800000,
            0.7437
          ],
          [
            1180051200000,
            0.7441
          ],
          [
            1180310400000,
            0.7434
          ],
          [
            1180396800000,
            0.7403
          ],
          [
            1180483200000,
            0.7453
          ],
          [
            1180569600000,
            0.7434
          ],
          [
            1180656000000,
            0.7444
          ],
          [
            1180915200000,
            0.7418
          ],
          [
            1181001600000,
            0.7391
          ],
          [
            1181088000000,
            0.7401
          ],
          [
            1181174400000,
            0.7425
          ],
          [
            1181260800000,
            0.7492
          ],
          [
            1181520000000,
            0.7489
          ],
          [
            1181606400000,
            0.7494
          ],
          [
            1181692800000,
            0.7527
          ],
          [
            1181779200000,
            0.7518
          ],
          [
            1181865600000,
            0.7512
          ],
          [
            1182124800000,
            0.7461
          ],
          [
            1182211200000,
            0.7462
          ],
          [
            1182297600000,
            0.7449
          ],
          [
            1182384000000,
            0.7465
          ],
          [
            1182470400000,
            0.7441
          ],
          [
            1182729600000,
            0.743
          ],
          [
            1182816000000,
            0.743
          ],
          [
            1182902400000,
            0.7443
          ],
          [
            1182988800000,
            0.7427
          ],
          [
            1183075200000,
            0.7406
          ],
          [
            1183334400000,
            0.736
          ],
          [
            1183420800000,
            0.7353
          ],
          [
            1183507200000,
            0.7344
          ],
        ]
      }]
    });
  }

  pieChart(id) {
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
        data: [
          {
            name: 'Equity',
            y: 23,
            color: "#A6CEE3",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Debt',
            y: 13,
            color: "#1F78B4",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Hybrid',
            y: 25.42,
            color: "#B2DF8A",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            y: 12.61,
            color: "#33A02C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#FB9A99",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#E31A1C",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#FDBF6F",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#FF7F00",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#CAB2D6",
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            y: 23.42,
            color: "#6A3D9A",
            dataLabels: {
              enabled: false
            }
          }
        ]
      }]
    });
  }
}
