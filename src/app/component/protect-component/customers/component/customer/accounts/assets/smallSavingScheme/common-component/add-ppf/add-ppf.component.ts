import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-ppf',
  templateUrl: './add-ppf.component.html',
  styleUrls: ['./add-ppf.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPpfComponent implements OnInit {
  isOptionalField: boolean;

  constructor(private fb: FormBuilder,private subInjectService: SubscriptionInject) { }
  ppfSchemeForm = this.fb.group({
    owner: [, [Validators.required]],
    accountBalance: [, [Validators.required]],
    balanceAsOn: [, [Validators.required]],
    futureContribution: [, [Validators.required]],
    frquency: [, [Validators.required]],
  })
   transactionForm=this.fb.group({
    transactionType: [, [Validators.required]],
    date: [, [Validators.required]],
    amount: [, [Validators.required]]
   })
  optionalppfSchemeForm = this.fb.group({
    description: [, [Validators.required]],
    bankName: [,[Validators.required]],
    linkedBankAccount: [,[Validators.required]],
    nominee: [,[Validators.required]]

  })
  ngOnInit() {
    this.isOptionalField=false;
  }
  moreFields()
  {
    (this.isOptionalField)?this.isOptionalField=false:this.isOptionalField=true
  }
  addTransaction()
  {

  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
