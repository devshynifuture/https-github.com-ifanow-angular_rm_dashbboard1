import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor( public eventService: EventService) { }

  ngOnInit() {
    this.pieChart('piechartMutualFund')
  }
  currentTabs(value) {
    this.eventService.tabData(value.selectedTab)
  }
  lineChart(id){
   
  }
  pieChart(id){
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
            },{
                name: 'Debt',
                y: 13,
                color: "#1F78B4",
                dataLabels: {
                    enabled: false
                }
            },{
                name: 'Hybrid',
                y: 25.42,
                color: "#B2DF8A",
                dataLabels: {
                    enabled: false
                }
            },{
                name: 'Other',
                y: 12.61,
                color: "#33A02C",
                dataLabels: {
                    enabled: false
                }
            },{
            	name: 'Solutions oriented',
                y: 23.42,
                 color: "#FB9A99",
                dataLabels: {
                    enabled: false
                }
            },{
            	name: 'Solutions oriented',
                y: 23.42,
                 color: "#E31A1C",
                dataLabels: {
                    enabled: false
                }
            },{
            	name: 'Solutions oriented',
                y: 23.42,
                 color: "#FDBF6F",
                dataLabels: {
                    enabled: false
                }
            },{
            	name: 'Solutions oriented',
                y: 23.42,
                 color: "#FF7F00",
                dataLabels: {
                    enabled: false
                }
            },{
            	name: 'Solutions oriented',
                y: 23.42,
                 color: "#CAB2D6",
                dataLabels: {
                    enabled: false
                }
            },{
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
