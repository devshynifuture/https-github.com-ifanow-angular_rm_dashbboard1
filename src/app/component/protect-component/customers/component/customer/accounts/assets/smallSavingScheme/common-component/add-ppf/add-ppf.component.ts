import { Component, OnInit, Input } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';
import { EventService } from 'src/app/Data-service/event.service';

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
  advisorId: any;
  ownerName: any;
  familyMemberId: any;
  inputData: any;
  ownerData: any;
  ppfSchemeForm;
  transactionForm
  optionalppfSchemeForm;
  transactionList=[];
  constructor(private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  addTransaction() {
    // if (this.transactionList.length>0) {
      let obj =
      {
        "date": '',
        "amount": '',
        "paymentType": ''
      }
      this.transactionList.push(obj)
      console.log(this.transactionList)
    // }
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    this.ppfSchemeForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      accountBalance: [, [Validators.required]],
      balanceAsOn: [, [Validators.required]],
      commencementDate: [, [Validators.required]],
      futureContribution: [, [Validators.required]],
      frquency: [, [Validators.required]],
    })
    this.transactionForm = this.fb.group({
      transactionType: [, [Validators.required]],
      date: [, [Validators.required]],
      amount: [, [Validators.required]]
    })
    this.optionalppfSchemeForm = this.fb.group({
      description: [, [Validators.required]],
      bankName: [, [Validators.required]],
      linkedBankAccount: [, [Validators.required]],
      nominee: [, [Validators.required]]

    })
    this.ownerData = this.ppfSchemeForm.controls;

  }
  addPPF() {
    if (this.ppfSchemeForm.get('accountBalance').invalid) {
      // this.ppfSchemeForm.get('accountBalance').status="INVALIDF"
      return;
    }
    else if (this.ppfSchemeForm.get('balanceAsOn').invalid) {
      return;
    }
    else if (this.ppfSchemeForm.get('commencementDate').invalid) {
      return;
    }
    else if (this.ppfSchemeForm.get('futureContribution').invalid) {
      return;
    }
    else if (this.ppfSchemeForm.get('frquency').invalid) {
      return;
    }
    else {
      let obj = {
        "advisorId": this.advisorId,
        "clientId": 2978,
        "ownerName": this.ownerName,
        "familyMemberId": this.familyMemberId,
        "accountBalance": this.ppfSchemeForm.get('accountBalance').value,
        "balanceAsOn": this.ppfSchemeForm.get('balanceAsOn').value,
        "commencementDate": this.ppfSchemeForm.get('commencementDate').value,
        "description": this.optionalppfSchemeForm.get('description').value,
        "bankName": this.optionalppfSchemeForm.get('bankName').value,
        "linkedBankAccount": this.optionalppfSchemeForm.get('linkedBankAccount').value,
        "nomineeName": this.optionalppfSchemeForm.get('nominee').value,
        "publicprovidendfundtransactionlist": [
          // {
          //   "date": "2019-09-01",
          //   "amount": 87.00,
          //   "paymentType": "Withdraw"
          // }
          // ,
          // {
          //   "date": "2019-09-03",
          //   "amount": 8907.00,
          //   "paymentType": "Deposite"
          // }
        ]
      }
      this.cusService.addPPFScheme(obj).subscribe(
        data => this.addPPFResponse(data),
        err => this.eventService.openSnackBar(err)
      )
    }
  }
  addPPFResponse(data) {
    console.log(data)
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
