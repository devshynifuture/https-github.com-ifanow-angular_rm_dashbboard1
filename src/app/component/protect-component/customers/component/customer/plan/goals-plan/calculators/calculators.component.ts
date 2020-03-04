import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.component.html',
  styleUrls: ['./calculators.component.scss']
})
export class CalculatorsComponent implements OnInit {
  calculator: FormGroup;
  
  @Input() data: any = {};
  @Input() popupHeaderText: string = 'CALCULATORS - NEW HOUSE';

  constructor(
    private subInjectService: SubscriptionInject,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }


  getdataForm(data) {
    this.calculator = this.fb.group({
      income: [data ? data.income : '', [Validators.required, Validators.pattern('[0-9]*')]],
      growthRate: [data ? data.growth : '', [Validators.required, Validators.pattern('^\d+(\.\d{1,2})?$')]],
      otherEMI: [data ? data.otherEMI : '', [Validators.required, Validators.pattern('[0-9]*')]],
      loanAmt: [data ? data.loanAmt : '', [Validators.required, Validators.pattern('[0-9]*')]],
      loanTenure: [data ? data.loanTenure : '', [Validators.required, Validators.pattern('[0-9]*')]],
      interestRate: [data ? data.interestRate : '', [Validators.required, Validators.pattern('^\d+(\.\d{1,2})?$')]],
    });
  }

  close() {
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
