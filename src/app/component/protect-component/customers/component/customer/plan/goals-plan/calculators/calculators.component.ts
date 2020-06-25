import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.scss']
})
export class CalculatorsComponent implements OnInit {
  
  @Input() data: any = {};
  @Input() popupHeaderText: string = 'CALCULATORS';
  
  incomeFG: FormGroup;
  loanFG: FormGroup;
  
  calculatedEMI:any = {
  }

  constructor(
    private subInjectService: SubscriptionInject,
    private eventService: EventService, 
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private planService: PlanService,
  ) { }

  ngOnInit() {
    this.getdataForm();

    // TODO:- remove the below method if no use found.
    // this.incomeFG.valueChanges.pipe(
    //   debounceTime(300),
    // ).subscribe(() => {
    //   if(this.incomeFG.valid) {
    //     console.log('Wow it works!!!!');
    //   }
    // })
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
    })
  }

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
        savingStartDate: this.datePipe.transform(this.data.remainingData.savingStartDate, 'yyyy/MM/dd')
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

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
