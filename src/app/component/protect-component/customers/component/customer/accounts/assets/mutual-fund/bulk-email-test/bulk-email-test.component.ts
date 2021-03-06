import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MutualFundOverviewComponent } from '../mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import { UtilService } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
import { MfServiceService } from '../mf-service.service';

@Component({
  selector: 'app-bulk-email-test',
  templateUrl: './bulk-email-test.component.html',
  styleUrls: ['./bulk-email-test.component.scss'],
  providers: [MutualFundOverviewComponent],
})
export class BulkEmailTestComponent implements OnInit {
  data: any;
  sendData = [{
    clientId: 88317
  }]
  getObj: any;
  dataSource3: any;
  dataSource: any;
  mfData: any;
  dataSource4: any;
  dataSource2: any;
  chart: any;
  getOrgData: any;
  userInfo: any;
  details: any;
  clientData: any;
  equityCurrentValue: any;
  debtCurrentValue: any;
  hybridCurrentValue: any;
  solution_OrientedCurrentValue: any;
  otherCurrentValue: any;
  reportDate: any;
  equityPercentage: any;
  debtPercentage: any;
  hybridPercenatge: any;
  solution_OrientedPercenatge: any;
  otherPercentage: any;
  total_net_Gain: any;
  fragmentData: any;
  mutualFund: string;
  svg: any;

  constructor(public overview: MutualFundOverviewComponent, private UtilService: UtilService, public mfService: MfServiceService) { }
  @ViewChild('mfOverviewTemplate', { static: false }) mfOverviewTemplate: ElementRef;

  ngOnInit() {
    this.fragmentData = {}
    this.getUploadData();
    this.fragmentData.isSpinner = true;
    this.mfService.getSendData()
      .subscribe(res => {
        this.getObj = res; //used for getting mutual fund data coming from main gain call
        if (this.getObj.hasOwnProperty('dataSource3') && this.getObj.hasOwnProperty('dataSource') && this.getObj.mfData && this.getObj.hasOwnProperty('dataSource4') && this.getObj.hasOwnProperty('dataSource2')) {
          this.getAllData()
        }
      })
    console.log(this.getObj)
  }

  ngAfterViewInit() {
    this.pieChart('piechartMutualFund');
    this.generatePdf()
  }
  getUploadData() {
    this.getObj = this.overview.uploadData(this.sendData)
    console.log('data ======', this.getObj)
    console.log(this.getObj)
  }
  getAllData() {
    this.dataSource3 = this.getObj.dataSource3;
    this.dataSource = this.getObj.dataSource;
    this.mfData = this.getObj.mfData;
    this.dataSource4 = this.getObj.dataSource4;
    this.dataSource2 = this.getObj.dataSource2;
    this.chart = this.getObj.dataSource2;
    this.equityPercentage = this.getObj.equityPercentage;
    this.debtPercentage = this.getObj.debtPercentage;
    this.otherPercentage = this.getObj.otherPercentage;
    this.hybridPercenatge = this.getObj.hybridPercenatge;
    // pie chart data after calculating percentage
  }
  generatePdf() {
    this.svg = this.chart.getSVG()
    let para = document.getElementById('templateOver');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Overview',
      landscape: true,
      key: 'showPieChart',
      svg: this.svg
    }
    this.UtilService.htmlToPdf('',para.innerHTML, 'Overview', false, this.fragmentData, '', '',true)
    return obj

  }
  pieChart(id) {
    this.chart = Highcharts.chart('piechartMutualFund', {
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
      exporting: { enabled: false },
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
          center: ['52%', '50%'],
          size: '125%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '60%',
        animation: false,
        states: {
          hover: {
            enabled: false
          }
        },
        data: [
          {
            name: 'Equity',
            // y:20,
            y: (this.equityPercentage) ? this.equityPercentage : 0,
            color: '#008FFF',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Debt',
            // y:20,
            y: (this.debtPercentage) ? this.debtPercentage : 0,
            color: '#5DC644',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Hybrid',
            // y:20,
            y: (this.hybridPercenatge) ? this.hybridPercenatge : 0,
            color: '#FFC100',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Other',
            // y:20,
            y: (this.otherPercentage) ? this.otherPercentage : 0,
            color: '#A0AEB4',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Solutions oriented',
            // y:20,
            y: (this.solution_OrientedPercenatge) ? this.solution_OrientedPercenatge : 0,
            color: '#FF7272',
            dataLabels: {
              enabled: false
            }
          }
        ]
      }]
    });
    //this.generatePdf()
  }
}
