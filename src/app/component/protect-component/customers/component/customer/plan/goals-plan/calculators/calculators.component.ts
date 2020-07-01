import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { ValidatorType } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';
import { AuthService } from 'src/app/auth-service/authService';
import { AppConstants } from 'src/app/services/app-constants';

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
  advisorId:number;
  clientId: number;
  showDelayChart:boolean = false;
  currentTab = 0;

  delayArray = [];
  
  calculatedEMI:any = {
  }

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
      this.delayArray.push({value: index+1, display: index + 1 + ' Years'});
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
      delay1: ['', [Validators.required]],
      delay2: ['', [Validators.required]],
      delay3: ['', [Validators.required]],
      delay4: ['', [Validators.required]],
    })
  }

  // ---------------------------------- calculator ---------------------------------------
  calculateEMI(){
    if(this.incomeFG.invalid || this.loanFG.invalid) {
      this.incomeFG.markAllAsTouched();
      this.loanFG.markAllAsTouched();
    } else {

      const emiObj = {
        netSalary: this.incomeFG.controls.income.value,
        loanTenure: this.loanFG.controls.loanTenure.value,
        annualInterestRate: this.loanFG.controls.interestRate.value,
        previousEMIs: this.incomeFG.controls.otherEMI.value,
        incomeGrowthRate: this.incomeFG.controls.growthRate.value,
        loanAmount: this.loanFG.controls.loanAmt.value,
        goalStartDate: this.datePipe.transform(this.data.remainingData.goalStartDate, AppConstants.DATE_FORMAT_DASHED),
        goalAmount: this.data.gv
      }

      this.planService.calculateEMI({loanIpJson: JSON.stringify(emiObj)}).subscribe((res) => {
        this.calculatedEMI = {
          ...res,
          ...emiObj
        };
        this.subInjectService.setRefreshRequired();
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
    }
  }

  saveEMIToGoal(){
    if(this.incomeFG.invalid || this.loanFG.invalid) {
      this.incomeFG.markAllAsTouched();
      this.loanFG.markAllAsTouched();
    } else {

      const emiObj = {
        netSalary: this.incomeFG.controls.income.value,
        loanTenure: this.loanFG.controls.loanTenure.value,
        annualInterestRate: this.loanFG.controls.interestRate.value,
        previousEMIs: this.incomeFG.controls.otherEMI.value,
        incomeGrowthRate: this.incomeFG.controls.growthRate.value,
        loanAmount: this.loanFG.controls.loanAmt.value,
        goalStartDate: this.datePipe.transform(this.data.remainingData.goalStartDate, AppConstants.DATE_FORMAT_DASHED),
        goalAmount: this.data.gv,
        goalId: this.data.remainingData.id,
        goalType: this.data.goalType
      }

      this.planService.saveEMIToGoal(emiObj).subscribe((res) => {
        this.eventService.openSnackBar("EMI saved to goal", "Dismiss");
        this.subInjectService.setSliderData(res);
        this.subInjectService.setRefreshRequired();
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      })
    }
  }

  saveToGoal(){
    if(this.incomeFG.valid && this.loanFG.valid) {
      // combine previous data if needed
      let data = {
        ...this.data,
      }
      this.subInjectService.closeNewRightSlider({ state: 'close', data: data, refreshRequired: true })
    }
  }

  resetIncome(){
    this.incomeFG.controls.income.setValue('');
  }

  resetIncomeFG(){
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
    yAxis:{
      visible: false
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [{data: []}]
  }
  createChart(res){
    const colors = ['green', 'blue', 'yellow', 'red'];

    let lumpsumSeries = JSON.parse(JSON.stringify(this.options));
    let sipSeries = JSON.parse(JSON.stringify(this.options));
    let count = 0;
    for(let k in res) {
      if(res.hasOwnProperty(k)) {
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
  
  calculateDelay(){
    if(this.delayFG.invalid) {
      this.delayFG.markAllAsTouched();
      return;
    }

    let subData = this.data.remainingData;
    let jsonObj = {
      differentGoalYears: subData.differentGoalYears.map(year => this.datePipe.transform(year, AppConstants.DATE_FORMAT_DASHED)),
      targetValueOfRequiredFVDebt: subData.targetValueOfRequiredFVDebt,
      targetValueOfRequiredFVEquity: subData.targetValueOfRequiredFVEquity,
      advisorId:this.advisorId,
      savingStartDate: this.datePipe.transform(subData.savingStartDate, AppConstants.DATE_FORMAT_DASHED),
      savingEndDate: this.datePipe.transform(subData.savingEndDate, AppConstants.DATE_FORMAT_DASHED),
      yearStepUps:[0],
    }

    let formValue:Object = this.delayFG.value;

    for(let k in formValue) {
      if(formValue.hasOwnProperty(k)){
        jsonObj.yearStepUps.push(formValue[k]);
      }
    }

    this.planService.calculateCostToDelay(jsonObj).subscribe(res => {
      this.showDelayChart = true;
      setTimeout(() => {
        this.createChart(res);
      }, 100);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  saveDelayToGoal(){
    if(this.delayFG.invalid) {
      this.delayFG.markAllAsTouched();
      return;
    }
    let subData = this.data.remainingData;
    let jsonObj = {
      goalId: subData.id,
      goalType: this.data.goalType,
      savingStartDate: this.datePipe.transform(subData.savingStartDate, AppConstants.DATE_FORMAT_DASHED),
      savingEndDate: this.datePipe.transform(subData.savingEndDate, AppConstants.DATE_FORMAT_DASHED),
      yearStepUps:[0],
    }

    let formValue:Object = this.delayFG.value;

    for(let k in formValue) {
      if(formValue.hasOwnProperty(k))
      jsonObj.yearStepUps.push(formValue[k]);
    }

    this.planService.saveCostToDelay(jsonObj).subscribe(res => {
      this.eventService.openSnackBar("Cost of delay added to goal", "Dismiss");
      this.subInjectService.setSliderData(res);
      this.subInjectService.setRefreshRequired();
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  // ---------------------------------- cost of delay ------------------------------------

  save() {
    switch(this.currentTab) {
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
    switch(pg) {
      case 0:
      case 4:
        const costDelay:Object = this.data.remainingData.costDelay;
        if(costDelay && costDelay.hasOwnProperty(0)) {
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
