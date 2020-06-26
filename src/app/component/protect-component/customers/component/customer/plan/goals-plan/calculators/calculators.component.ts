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
      delay1: ['', [Validators.required]],
      delay2: ['', [Validators.required]],
      delay3: ['', [Validators.required]],
      delay4: ['', [Validators.required]],
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
        savingStartDate: this.datePipe.transform(this.data.remainingData.savingStartDate, 'yyyy/MM/dd'),
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
      text: 'Monthly Bar Chart'
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
    series: []
  }
  createChart(res){
    let data = [{
        y: 123,
        name: this.delayFG.controls.delay1.value.display,
        color: 'green'
    }, {
        y: 60,
        name:  this.delayFG.controls.delay1.value.display,
        color: 'blue'
    }, {
        y: 43,
        name:  this.delayFG.controls.delay1.value.display,
        color: 'yellow'
    }, {
        y: 55,
        name:  this.delayFG.controls.delay1.value.display,
        color: 'red'
    }];
    this.options.series.push(data);
    Highcharts.chart('monthly-chart-container', this.options);
    Highcharts.chart('lumpsum-chart-container', this.options);
  }
  
  calculateDelay(){
    if(this.delayFG.invalid) {
      this.delayFG.markAllAsTouched();
      return;
    }
    
    let subData = this.data.remainingData;
    let jsonObj = {
      differentGoalYears: subData.differentGoalYears,
      targetValueOfRequiredFVDebt: subData.targetValueOfRequiredFVDebt,
      targetValueOfRequiredFVEquity: subData.targetValueOfRequiredFVEquity,
      advisorId:this.advisorId,
      savingStartDate: this.datePipe.transform(subData.savingStartDate, 'yyyy/MM/dd'),
      savingEndDate: this.datePipe.transform(subData.savingStartDate, 'yyyy/MM/dd'),
      yearStepUps:[0],
    }

    let formValue:Object = this.delayFG.value;

    for(let k in formValue) {
      if(formValue.hasOwnProperty(k))
      jsonObj.yearStepUps.push(formValue[k]);
    }

    this.planService.calculateCostToDelay(jsonObj).subscribe(res => {
      console.log(res);
      this.createChart(res);
    }, err => {
      this.eventService.openSnackBar(err, "Dismiss");
    })
  }

  // ---------------------------------- cost of delay ------------------------------------

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
