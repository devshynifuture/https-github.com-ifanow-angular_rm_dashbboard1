import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MutualFundOverviewComponent } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mutual-fund/mutual-fund-overview/mutual-fund-overview.component';
import * as Highcharts from 'highcharts';
import { UtilService } from 'src/app/services/util.service';
import { MfServiceService } from 'src/app/component/protect-component/customers/component/customer/accounts/assets/mutual-fund/mf-service.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-bulk-overview',
  templateUrl: './bulk-overview.component.html',
  styleUrls: ['./bulk-overview.component.scss'],
  providers: [MutualFundOverviewComponent],

})
export class BulkOverviewComponent implements OnInit {
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
  inputData: any;
  clientId: any;
  totalValue: any;
  sendData: any;

  constructor(public overview: MutualFundOverviewComponent,
    private utilService : UtilService,
    public mfService: MfServiceService) { }
  @ViewChild('mfOverviewTemplate', { static: false }) mfOverviewTemplate: ElementRef;
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
    if(data){
      this.clientId = data.clientId;
      this.sendData = data
      this.userInfo =  (data.userInfo)? data.userInfo.advisorData: '-';
      this.clientData = (data.userInfo)?  data.userInfo.clientData: '-';
      this.ngOnInit()
    }
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.reportDate = new Date()
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
    let para = document.getElementById('templateOver');
    if(para.innerHTML){
      this.pieChart('piechartMutualFund');
      this.generatePdf()
    }
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
    this.totalValue = this.getObj.totalValue;
  }
  generatePdf() {
    this.svg = this.chart.getSVG()
    let para = document.getElementById('templateOver');
    let obj = {
      htmlInput: para.innerHTML,
      name: 'Overview`s',
      landscape: true,
      key: 'showPieChart',
      svg: this.svg,
      clientId : 97118,
      advisorId : AuthService.getAdvisorId(),
      fromEmail: 'devshyni@futurewise.co.in',
      toEmail: 'devshyni@futurewise.co.in'
    }
    this.utilService.bulkHtmlToPdf(obj)
    //this.utilService.htmlToPdf(para.innerHTML, 'Overview', false, this.fragmentData, '', '')
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
