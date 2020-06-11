import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from 'src/app/Data-service/event.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../customer.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EnumServiceService } from 'src/app/services/enum-service.service';
import { EnumDataService } from 'src/app/services/enum-data.service';

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
    }

  cashFlowFG:FormGroup;
  subscription = new Subscription();
  noCashflowData: boolean = false;

  finalTotal: number;
  cashflowFlag: boolean;
  letsideBarLoader: boolean;
  summaryFlag: boolean;
  allBanks:any[] = [];
  families:any[] = [];
  cashFlowDescNaming:any[] = [];
  constructor(
    public eventService: EventService, 
    private cusService: CustomerService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private enumService: EnumServiceService,
  ) {}

  ngOnInit() {
    this.cashFlowFG = this.fb.group({
      'inflow': [true],
      'outflow': [true],
      'bankfilter': ['all'],
      'familyfilter': ['all']
    })
    this.userData = AuthService.getUserInfo();
    this.asOnDate = new Date().getTime();
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId() !== undefined ? AuthService.getClientId() : -1;
    this.calculateTotalSummaryValues();
    this.subscribeToCashflowChanges();
    this.cashFlowDescNaming = this.enumService.getAssetNamings();
  }

  subscribeToCashflowChanges(){
    this.cashFlowFG.valueChanges.subscribe(()=> {
      this.filterCashflowData()
    })
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
          // this.mutualFundValue = data[3];
          // this.mutualFundValue = data.filter(element => element.assetType == 5);
          // this.mutualFundValue = this.mutualFundValue[0];
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
          this.Commodities = this.Commodities[0]
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
          this.totalOfLiabilitiesAndTotalAssset(this.summaryTotalValue);
          this.letsideBarLoader = false;
          this.summaryMap = tempSummaryTotalValue;
          this.pieChart('piechartMutualFund', this.summaryTotalValue);
        }
      },
      err => {
        this.letsideBarLoader = false;
        this.finalTotal = 0;
        this.liabilityTotal = 0;
        this.totalAssetsWithoutLiability = 0;
      }
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
      err => {
        this.finalTotal = 0
      }
    );
  }

  getCashFlowList(obj) {
    this.cashflowFlag = true;
    this.cashFlowViewDataSource = [{}, {}, {}];
    this.cusService.getCashFlowList(obj).subscribe(
      data => {
        this.cashflowFlag = false;
        this.filterCashFlow = Object.assign({}, data);
        this.cashFlowViewDataSource = [];
        if(data.income.length === 0 && data.expense.length === 0) {
          this.noCashflowData = true;
        } 
        this.incomeList = [];
        this.expenseList = [];
        this.createFilterList();
        this.sortDataUsingFlowType(data);
      },
      err => {
        this.cashFlowViewDataSource = []
        this.noCashflowData = true;
      }
    );
  }

  sortDataUsingFlowType(ObjectArray) {
    this.inflowFlag = false;
    this.outflowFlag = false;

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
    } else if (ObjectArray['income'].length > 0) {
      this.cashFlowViewDataSource = ObjectArray['income'];
      ObjectArray['income'].forEach(element => {
        element['colourFlag'] = true;
        this.incomeList.push(Math.round(element.currentValue));
      });
      this.inflowFlag = true;
    }
    else {
      this.cashFlowViewDataSource = [];
    }
    this.cashFlow('cashFlow', ObjectArray);
  }

  createFilterList() {
    this.allBanks = [];
    let cashflows = [...this.filterCashFlow.expense, ...this.filterCashFlow.income];
    
    let banks = [...new Set(cashflows.map(flow => flow.userBankMappingId))]
    this.allBanks = banks.map(bank => {
      let tnx = cashflows.find(tnx => tnx.userBankMappingId === bank);
      let bankObj = {
        name: tnx.bankName,
        id: bank
      }
      // non linked bank id is 0
      if(bank === 0) {
        bankObj.name = 'Non-linked banks'
      }
      return bankObj;
    });
    
    let families = [...new Set(cashflows.map(flow => flow.familyMemberId))]
    this.families = families.map(family => {
      let tnx = cashflows.find(tnx => tnx.familyMemberId === family);
      let bankObj = {
        name: tnx.ownerName,
        id: family
      }
      return bankObj;
    });
  }


  filterCashflowData() {
    this.incomeList = [];
    this.expenseList = [];
    
    let cashflows = [...this.filterCashFlow.expense, ...this.filterCashFlow.income];

    if(this.cashFlowFG.controls.bankfilter.value != 'all') {
      cashflows = cashflows.filter(flow => flow.userBankMappingId === this.cashFlowFG.controls.bankfilter.value);
    }

    if(this.cashFlowFG.controls.familyfilter.value != 'all') {
      cashflows = cashflows.filter(flow => flow.familyMemberId === this.cashFlowFG.controls.familyfilter.value);
    }

    let cashflowObj = {
      income: [],
      expense: []
    }
    if(this.cashFlowFG.controls.inflow.value) {
      cashflowObj.income = cashflows.filter(flow => flow.inputOutputFlag === 1);
    }

    if(this.cashFlowFG.controls.outflow.value) {
      cashflowObj.expense = cashflows.filter(flow => flow.inputOutputFlag === -1);
    }
    
    this.sortDataUsingFlowType(cashflowObj);
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
    this.finalTotal = this.totalAssetsWithoutLiability - this.liabilityTotal;
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
        categories: timeArray,
        visible: false
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
        data: this.incomeList,
        showInLegend: false,
        type: undefined,
      }, {
        name: 'Expense',
        color: '#ef6725',
        data: this.expenseList,
        showInLegend: false,
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

  getShortForm(elem) {
    let name = this.cashFlowDescNaming.find(asset => asset.assetType === elem.assetType);
    if(name) {
      return name.assetShortName;
    }
    return '';
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
