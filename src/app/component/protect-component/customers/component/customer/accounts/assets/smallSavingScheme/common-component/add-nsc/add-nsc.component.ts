import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';

@Component({
  selector: 'app-add-nsc',
  templateUrl: './add-nsc.component.html',
  styleUrls: ['./add-nsc.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddNscComponent implements OnInit {

  constructor(private fb: FormBuilder,private subInjectService: SubscriptionInject) { }
  isOptionalField
  ngOnInit() {
    this.isOptionalField = false
  }
  nscFormField = this.fb.group({
    owner: [, [Validators.required]],
    amountInvested: [, [Validators.required]],
    commDate: [, [Validators.required]],
    Tenure:  [, [Validators.required]],
      ownershipType: [, [Validators.required]]

   })
   nscFormOptionalField=this.fb.group({
      cNo:[,[Validators.required]],
      poBranch:[,[Validators.required]],
      nominee:[,[Validators.required]],
      linkedBankAccount:[,[Validators.required]],
      description:[,[Validators.required]]
   })
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true

  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
