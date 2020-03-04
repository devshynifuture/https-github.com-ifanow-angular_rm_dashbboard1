import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.scss']
})
export class CalculatorsComponent implements OnInit {
  
  @Input() data: any = {};
  @Input() popupHeaderText: string = 'CALCULATORS - NEW HOUSE';
  
  incomeFG: FormGroup;
  loanFG: FormGroup;
  
  maxAmtAvailable: number = 3481356;
  incomeInGoalYr: number = 241577;
  highestLoanAvailable: number = 3481356;
  highestEMIAvailable: number = 120788;
  loanToBeTaken: number = 3481356;
  emiPayable: number = 120788;
  originalGoalAmt: number = 3481356;
  dwnPaymentAmt: number = 120788;
  monthlyReq: number = 3481356;
  lumpsumReq: number = 120788;

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getdataForm();

    // TODO:- remove the below method if no use found.
    this.incomeFG.valueChanges.pipe(
      debounceTime(300),
    ).subscribe(() => {
      if(this.incomeFG.valid) {
        console.log('Wow it works!!!!');
      }
    })
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
