import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { AppConstants } from 'src/app/services/app-constants';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.scss']
})
export class CalculatorsComponent implements OnInit {

  @Input() data: any = {};
  @Input() popupHeaderText: string = 'CALCULATORS';
  validatorType = ValidatorType;

  incomeFG: FormGroup;
  loanFG: FormGroup;
  delayFG: FormGroup;
  advisorId: number;
  clientId: number;
  showDelayChart: boolean = false;
  currentTab = 0;

  delayArray = [];

  calculatedEMI: any = {
  }

  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'ADD TO GOAL',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };

  barButtonOptions1: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  chart: Highcharts.Chart;
  perLoanAmt: number;
  downPayPer: any;
  downPayement: any;
  loanAmount: any;

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private planService: PlanService,
  ) {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }

  ngOnInit() {

    this.getdataForm();
    const yearGap = (new Date(this.data.goalStartDate).getFullYear()) - (new Date().getFullYear());
    for (let index = 0; index < yearGap; index++) {
      this.delayArray.push({ value: index + 1, display: index + 1 + ' Years' });
    }
  }

  getdataForm() {
    let loan = this.data.remainingData.loan;
    this.calculatedEMI = loan || {};
    this.incomeFG = this.fb.group({
      income: [loan ? loan.netSalary : '', [Validators.required, Validators.pattern('[0-9]*')]],
      growthRate: [loan ? loan.incomeGrowthRate : '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      otherEMI: [loan ? loan.previousEMIs : '', [Validators.required, Validators.pattern('[0-9]*')]],
    });
    this.loanFG = this.fb.group({
      loanAmt: [loan ? loan.loanAmount : '', [Validators.required, Validators.pattern('[0-9]*')]],
      loanTenure: [loan ? loan.loanTenure : '', [Validators.required, Validators.pattern('[0-9]*')]],
      interestRate: [loan ? loan.annualInterestRate : '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });

    this.delayFG = this.fb.group({
      delay1: ['',],
      delay2: ['',],
      delay3: ['',],
      delay4: ['',],
    })
    // setTimeout(() => {
    //   this.pieChart('')
    // }, 300);
  }

  // ---------------------------------- calculator ---------------------------------------
  calculateEMI() {
    if (this.incomeFG.invalid || this.loanFG.invalid || this.barButtonOptions.active || this.barButtonOptions1.active) {
      this.incomeFG.markAllAsTouched();
      this.loanFG.markAllAsTouched();
    } else {

      const emiObj = {
        netSalary: parseInt(this.incomeFG.controls.income.value),
        loanTenure: parseInt(this.loanFG.controls.loanTenure.value),
        annualInterestRate: parseInt(this.loanFG.controls.interestRate.value),
        previousEMIs: parseInt(this.incomeFG.controls.otherEMI.value),
        incomeGrowthRate: parseInt(this.incomeFG.controls.growthRate.value),
        loanAmount: parseInt(this.loanFG.controls.loanAmt.value),
        goalStartDate: this.datePipe.transform(this.data.remainingData.goalStartDate, AppConstants.DATE_FORMAT_DASHED),
        goalAmount: parseInt(this.data.remainingData.futureValue) ? this.data.remainingData.futureValue : this.data.remainingData.goalFV
      }

      this.barButtonOptions.active = true;
      this.barButtonOptions1.active = true;
      this.planService.calculateEMI({ loanIpJson: JSON.stringify(emiObj) }).subscribe((res) => {
        this.calculatedEMI = {
          ...res,
          ...emiObj
        };
        setTimeout(() => {
          this.pieChart('')
        }, 300);
        this.barButtonOptions.active = false;
        this.barButtonOptions1.active = false;
        this.subInjectService.setRefreshRequired();
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.barButtonOptions.active = false;
        this.barButtonOptions1.active = false;
      })
    }
  }
  pieChart(id) {
    this.downPayement =parseFloat(((this.calculatedEMI.downPayment / this.calculatedEMI.goalAmount)*100).toFixed(2))
    this.loanAmount = parseFloat(((this.calculatedEMI.loanAmount / this.calculatedEMI.goalAmount)*100).toFixed(2))
    console.log('this.downPayement', this.downPayement)
    console.log('this.loanAmount', this.loanAmount)
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
        y: 30
      },
      exporting: { enabled: false },
      tooltip: {
        pointFormat: ' <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -30,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: 0,
          endAngle: 360,
          center: ['52%', '50%'],
          size: '70%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize: '30%',
        animation: false,
        states: {
          hover: {
            enabled: false
          }
        },
        data: [
          {
            name: 'Loan amount',
            // y:20,
            y: (this.loanAmount),
            color: '#008FFF',
            dataLabels: {
              enabled: false
            }
          }, {
            name: 'Down payment',
            // y:20,
            y: (this.downPayement),
            color: '#FFC100',
            dataLabels: {
              enabled: false
            }
          },
        ]
      }]
    });
  }
  saveEMIToGoal() {
    if (this.incomeFG.invalid || this.loanFG.invalid || this.barButtonOptions.active || this.barButtonOptions1.active) {
      this.incomeFG.markAllAsTouched();
      this.loanFG.markAllAsTouched();
    } else {

      this.barButtonOptions.active = true;
      this.barButtonOptions1.active = true;
      const emiObj = {
        netSalary: this.incomeFG.controls.income.value,
        loanTenure: this.loanFG.controls.loanTenure.value,
        annualInterestRate: this.loanFG.controls.interestRate.value,
        previousEMIs: this.incomeFG.controls.otherEMI.value,
        incomeGrowthRate: this.incomeFG.controls.growthRate.value,
        downPayment: this.calculatedEMI.downPayment,
        loanAmount: this.loanFG.controls.loanAmt.value,
        goalStartDate: this.datePipe.transform(this.data.remainingData.goalStartDate, AppConstants.DATE_FORMAT_DASHED),
        goalAmount: this.data.remainingData.goalFV,
        goalId: this.data.remainingData.id,
        goalType: this.data.goalType
      }

      this.planService.saveEMIToGoal(emiObj).subscribe((res) => {
        this.eventService.openSnackBar("EMI saved to goal", "Dismiss");
        this.subInjectService.setSliderData(res);
        this.subInjectService.setRefreshRequired();
        this.barButtonOptions.active = false;
        this.barButtonOptions1.active = false;
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
        this.barButtonOptions.active = false;
        this.barButtonOptions1.active = false;
      })
    }
  }

  saveToGoal() {
    if (this.incomeFG.valid && this.loanFG.valid) {
      // combine previous data if needed
      let data = {
        ...this.data,
      }
      this.subInjectService.closeNewRightSlider({ state: 'close', data: data, refreshRequired: true })
    }
  }

  resetIncome() {
    this.incomeFG.controls.income.setValue('');
  }

  resetIncomeFG() {
    this.incomeFG.reset();
  }
  // ---------------------------------- calculator ---------------------------------------

  // ---------------------------------- cost of delay ------------------------------------

  // options set for bar charts
  // Reference - https://api.highcharts.com/highcharts/
  options: any = {
    chart: {
      type: 'bar',
      height: 200
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          align: 'left',
          inside: false
        }
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    xAxis: {
      type: 'category',
      lineWidth: 0,
      tickWidth: 0
    },
    yAxis: {
      visible: false
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [{ data: [] }]
  }
  createChart(res) {
    const colors = ['green', 'blue', 'yellow', 'red'];

    let lumpsumSeries = JSON.parse(JSON.stringify(this.options));
    let sipSeries = JSON.parse(JSON.stringify(this.options));
    let count = 0;
    for (let k in res) {
      if (res.hasOwnProperty(k)) {
        lumpsumSeries.series[0].data.push({
          y: Math.round(res[k].lumpsum_total),
          name: k + ' years',
          color: colors[count]
        })
        sipSeries.series[0].data.push({
          y: Math.round(res[k].sip_total),
          name: k + ' years',
          color: colors[count]
        })
        count++;
      }
    }
    Highcharts.chart('monthly-chart-container', sipSeries);
    Highcharts.chart('lumpsum-chart-container', lumpsumSeries);
  }

  calculateDelay() {
    if (this.delayFG.invalid || this.barButtonOptions.active || this.barButtonOptions1.active) {
      this.delayFG.markAllAsTouched();
      return;
    }

    this.barButtonOptions.active = true;
    this.barButtonOptions1.active = true;

    let subData = this.data.remainingData;
    let jsonObj = {
      differentGoalYears: subData.differentGoalYears.map(year => this.datePipe.transform(year, AppConstants.DATE_FORMAT_DASHED)),
      targetValueOfRequiredFVDebt: subData.targetValueOfRequiredFVDebt,
      targetValueOfRequiredFVEquity: subData.targetValueOfRequiredFVEquity,
      advisorId: this.advisorId,
      savingStartDate: this.datePipe.transform(subData.savingStartDate, AppConstants.DATE_FORMAT_DASHED),
      savingEndDate: this.datePipe.transform(subData.savingEndDate, AppConstants.DATE_FORMAT_DASHED),
      yearStepUps: [0],
    }

    let formValue: Object = this.delayFG.value;

    for (let k in formValue) {
      if (formValue.hasOwnProperty(k)) {
        jsonObj.yearStepUps.push(formValue[k]);
      }
    }

    this.planService.calculateCostToDelay(jsonObj).subscribe(res => {
      this.showDelayChart = true;
      setTimeout(() => {
        this.createChart(res);
        this.barButtonOptions.active = false;
        this.barButtonOptions1.active = false;
      }, 100);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  saveDelayToGoal() {
    if (this.delayFG.invalid || this.barButtonOptions.active || this.barButtonOptions1.active) {
      this.delayFG.markAllAsTouched();
      return;
    }
    let subData = this.data.remainingData;
    let jsonObj = {
      goalId: subData.id,
      goalType: this.data.goalType,
      savingStartDate: this.datePipe.transform(subData.savingStartDate, AppConstants.DATE_FORMAT_DASHED),
      savingEndDate: this.datePipe.transform(subData.savingEndDate, AppConstants.DATE_FORMAT_DASHED),
      yearStepUps: [0],
    }

    let formValue: Object = this.delayFG.value;
    this.barButtonOptions.active = true;
    this.barButtonOptions1.active = true;

    for (let k in formValue) {
      if (formValue.hasOwnProperty(k))
        jsonObj.yearStepUps.push(formValue[k]);
    }

    this.planService.saveCostToDelay(jsonObj).subscribe(res => {
      this.eventService.openSnackBar("Cost of delay added to goal", "Dismiss");
      this.subInjectService.setSliderData(res);
      this.subInjectService.setRefreshRequired();
      this.barButtonOptions.active = false;
      this.barButtonOptions1.active = false;
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
      this.barButtonOptions.active = false;
      this.barButtonOptions1.active = false;
    })
  }

  // ---------------------------------- cost of delay ------------------------------------

  save() {
    switch (this.currentTab) {
      case 0:
        this.saveEMIToGoal();
        break;
      case 1:
        break;
      case 2:
        break;
      case 4:
        this.saveDelayToGoal();
        break;

      default:
        console.error('Unexpected switch case found');
    }
  }

  initializePage(pg) {
    switch (pg) {
      case 0:
      case 4:
        const costDelay: Object = this.data.remainingData.costDelay;
        if (costDelay && costDelay.hasOwnProperty(0)) {
          this.showDelayChart = true;
          setTimeout(() => {
            this.createChart(costDelay);
          }, 100);
        }
        break;
    }
  }

  close() {
    this.subInjectService.closeNewRightSlider({ state: 'close' });
  }
}
