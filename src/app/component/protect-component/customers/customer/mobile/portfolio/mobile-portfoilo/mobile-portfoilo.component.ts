import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { Chart } from 'angular-highcharts';
import { AppConstants } from 'src/app/services/app-constants';
import { EventService } from 'src/app/Data-service/event.service';
import { CustomerService } from 'src/app/component/Services/customer.service';

@Component({
  selector: 'app-mobile-portfoilo',
  templateUrl: './mobile-portfoilo.component.html',
  styleUrls: ['./mobile-portfoilo.component.scss']
})
export class MobilePortfoiloComponent implements OnInit {
  openMenue: boolean = false;
  inputData: any;
  advisorId: any;
  clientId: any;
  clientData: any;
  assetAllocationPieConfig: Chart;
  portFolioData: any[];
  hasError: boolean;
  chartTotal: number;

  showMf
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
  ]
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
  mfData: any;
  fixedIncome: any;
  showFixedIncome: boolean;
  showRetirementAccount: boolean;
  showRealEstate: boolean;
  showStocks: boolean;
  showCashAndBank: boolean;
  showLiablities: boolean;
  showSmallSavings: boolean;
  showCommodities: boolean;
  lifeInsuranceCv: any;
  generalInsuranceCv: any;
  liObj: {};
  giObj: {};
  showLifeInsurance: boolean;
  showGenralInsurance: boolean;
  allDataPort: any;
  constructor(
    public customerService: CustomerService,
    public eventService: EventService
  ) {
    // this.clientId = AuthService.getClientId()
    // this.advisorId = AuthService.getAdvisorId()
    this.clientData = AuthService.getClientData()
  }
  @Input()
  set data(data) {
    this.inputData = data;
    console.log('This is Input data of proceed ', data);
  }
  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.portFolioData = [];
    this.getLifeInsurance();
    this.generalInsurance();
    this.getAssetAllocationData()
    this.initializePieChart()
  }
  getLifeInsurance() {
    const obj = {
      advisorId: this.clientData.advisorId,
      clientId: this.clientData.clientId,
      insuranceTypeId: 1,

    };
    this.customerService.getInsuranceData(obj).subscribe(
      data => {
        console.log(data);
        if(data){
          this.lifeInsuranceCv = data.currentValueSum;
        }else{
          this.lifeInsuranceCv = 0;

        }
        this.liObj = {
          currentValue: this.lifeInsuranceCv,
          assetType: 14,
          assetTypeString: 'Life insurance'

        }
        this.portFolioData.push(this.liObj)
        // Object.assign( this.portFolioData, {currentValue : this.lifeInsuranceCv, assetType : 14});
      },
      error => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  generalInsurance() {
    const obj = {
      advisorId: this.clientData.advisorId,
      clientId: this.clientData.clientId,
      insuranceSubTypeId: 0
    };
    this.customerService.getGeneralInsuranceData(obj).subscribe(
      data => {
        console.log(data);
        if(data){
          this.generalInsuranceCv = data.totalSumInsured
        }else{
          this.generalInsuranceCv = 0

        }
        this.giObj = {
          currentValue: this.generalInsuranceCv,
          assetType: 15,
          assetTypeString: 'General insurance'

        }
        this.portFolioData.push(this.giObj)
        // Object.assign( this.portFolioData, {currentValue : this.generalInsuranceCv, assetType : 15});
      },
      error => {
        this.eventService.showErrorMessage(error);
      }
    );
  }
  openAsset(asset) {
    console.log('assets', asset)
    if (asset.assetType == 7) {
      this.fixedIncome = asset
      this.showFixedIncome = true
    } else if (asset.assetType == 8) {
      this.showRealEstate = true;
    } else if (asset.assetType == 9) {
      this.showRetirementAccount = true;
    } else if (asset.assetType == 6) {
      this.showStocks = true;
    } else if (asset.assetType == 12) {
      this.showCommodities = true;
    } else if (asset.assetType == 31) {
      this.showCashAndBank = true;
    } else if (asset.assetType == 2) {
      this.showLiablities = true;
    } else if (asset.assetType == 10) {
      this.showSmallSavings = true;
    } else if (asset.assetType == 14) {
      this.showLifeInsurance = true;
    } else if (asset.assetType == 15) {
      this.showGenralInsurance = true;
    }
  }
  openMenu(flag) {
    if (flag == false) {
      this.openMenue = true
    } else {
      this.openMenue = false
    }
  }
  getAssetAllocationData() {
    this.mfData = []
    const obj = {
      clientId: this.clientData.clientId,
      advisorId: this.clientData.advisorId,
      targetDate: new Date().getTime()
    }


  //  this.loaderFn.increaseCounter();
    this.customerService.getAllFeedsPortFolio(obj).subscribe(res => {
      if (res == null) {
        this.portFolioData = [];
      } else {
        let stock = res.find(d => d.assetType == 6);
        this.portFolioData = res;
        this.allDataPort = res
        this.portFolioData.forEach(element => {
          if (element.assetType == 5) {
            this.mfData.push(element)
          }
        });
        this.portFolioData = this.portFolioData.filter(element => element.assetType != 5);
        this.liObj = {
          currentValue: this.lifeInsuranceCv,
          assetType: 14,
          assetTypeString: 'Life insurance'
        }
        this.portFolioData.push(this.liObj)
        this.giObj = {
          currentValue: this.generalInsuranceCv,
          assetType: 15,
          assetTypeString: 'General insurance'
        }
        this.portFolioData.push(this.giObj)

        console.log('assets', this.portFolioData)
        if (stock) {
          this.portFolioData = this.portFolioData.filter(d => d.assetType != 6);
          this.portFolioData.unshift(stock);
        }

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
        let pieChartData = res.filter(element => element.assetType != 2 && element.currentValue != 0);
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
              })
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
    //  this.loaderFn.decreaseCounter();
    }, err => {
      this.hasError = true;
      this.eventService.openSnackBar(err, "Dismiss")
      //this.loaderFn.decreaseCounter();
    })
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
  initializePieChart() {
    let chartConfig: any = {
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
    }
    this.assetAllocationPieConfig = new Chart(chartConfig);
    chartConfig.series = [{
      type: 'pie',
      animation: false,
      name: 'MF Asset allocation',
      innerSize: '60%',
      data: this.mfAllocationData
    }]
  }
  getValue(value) {
    this.showRetirementAccount = value;
    this.showStocks = value;
    this.showRealEstate = value;
    this.showCashAndBank = value;
    this.showCommodities = value;
    this.showSmallSavings = value;
    this.showLiablities = value;
    this.showGenralInsurance = value;
    this.showLifeInsurance = value;
  }
}
