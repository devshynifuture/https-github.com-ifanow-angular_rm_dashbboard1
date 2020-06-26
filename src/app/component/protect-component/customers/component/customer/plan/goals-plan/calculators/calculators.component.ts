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
    for (let index = 0; index < 10; index++) {
      this.delayArray.push({value: index+1, display: index + 1 + ' Years'});
    }
  }

  getdataForm() {
    this.incomeFG = this.fb.group({
      income: [this.data ? this.data.income : '', [Validators.required, Validators.pattern('[0-9]*')]],
      growthRate: [this.data ? this.data.growth : '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      otherEMI: [this.data ? this.data.otherEMI : '', [Validators.required, Validators.pattern('[0-9]*')]],
    });
    this.loanFG = this.fb.group({
      loanAmt: [this.data ? this.data.loanAmt : '', [Validators.required, Validators.pattern('[0-9]*')]],
      loanTenure: [this.data ? this.data.loanTenure : '', [Validators.required, Validators.pattern('[0-9]*')]],
      interestRate: [this.data ? this.data.interestRate : '', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    });

    this.delayFG = this.fb.group({
      delay1: [0, [Validators.required]],
      delay2: [0, [Validators.required]],
      delay3: [0, [Validators.required]],
      delay4: [0, [Validators.required]],
    })
  }

  // ---------------------------------- calculator ---------------------------------------
  calculate(){
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
        savingStartDate: this.datePipe.transform(this.data.remainingData.savingStartDate, AppConstants.DATE_FORMAT),
        goalAmount: this.data.gv
      }

      this.planService.calculateEMI({loanIpJson: JSON.stringify(emiObj)}).subscribe((res) => {
        this.calculatedEMI = {
          ...res,
          ...emiObj
        };
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
  
      this.subInjectService.changeNewRightSliderState({ state: 'close', data: data, refreshRequired: true })
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
      differentGoalYears: subData.differentGoalYears.map(year => this.datePipe.transform(year, AppConstants.DATE_FORMAT)),
      targetValueOfRequiredFVDebt: subData.targetValueOfRequiredFVDebt,
      targetValueOfRequiredFVEquity: subData.targetValueOfRequiredFVEquity,
      advisorId:this.advisorId,
      savingStartDate: this.datePipe.transform(subData.savingStartDate, AppConstants.DATE_FORMAT),
      savingEndDate: this.datePipe.transform(subData.savingEndDate, AppConstants.DATE_FORMAT),
      yearStepUps:[0],
    }

    let formValue:Object = this.delayFG.value;

    for(let k in formValue) {
      if(formValue.hasOwnProperty(k)){
        jsonObj.yearStepUps.push(formValue[k]);
      }
    }

    this.planService.calculateCostToDelay(jsonObj).subscribe(res => {
      console.log(res);
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
    let jsonObj = {
      goalId: this.data.id,
      goalType: this.data.goalType,
      yearStepUps:[0],
    }

    let formValue:Object = this.delayFG.value;

    for(let k in formValue) {
      if(formValue.hasOwnProperty(k))
      jsonObj.yearStepUps.push(formValue[k]);
    }

    this.planService.calculateCostToDelay(jsonObj).subscribe(res => {
      this.eventService.openSnackBar("Cost of delay added to goal", "Dismiss");
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  // ---------------------------------- cost of delay ------------------------------------

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
