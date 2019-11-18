import { Component, OnInit, Input } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { AuthService } from 'src/app/auth-service/authService';

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
  optionalppfSchemeForm
  constructor(private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.isOptionalField = false;
    this.advisorId=AuthService.getAdvisorId();
  }
  display(value){
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  addTransaction() {

  }
  getdataForm(data){
    if (data == undefined) {
      data = {};
    }
   this.ppfSchemeForm = this.fb.group({
      ownerName: [data.ownerName , [Validators.required]],
      accountBalance: [, [Validators.required]],
      balanceAsOn: [, [Validators.required]],
      commencementDate:[,[Validators.required]],
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
    if (this.ppfSchemeForm.valid) {
      let obj = {
        "advisorId": this.advisorId,
        "clientId": 2978,
        "ownerName":this.ownerName,
        "familyMemberId": this.familyMemberId,
        "accountBalance": this.ppfSchemeForm.get('accountBalance').value,
        "balanceAsOn": this.ppfSchemeForm.get('balanceAsOn').value,
        "commencementDate": "2019-10-10",
        "description": "saving schemes here",
        "bankName": "icici",
        "linkedBankAccount": "bankAcc112233",
        "nomineeName": "dev",
        "agentName": "akshay",


        "publicprovidendfundtransactionlist": [{
          "date": "2019-09-01",
          "amount": 87.00,
          "paymentType": "Withdraw"
        }
          ,
        {
          "date": "2019-09-03",
          "amount": 8907.00,
          "paymentType": "Deposite"
        }
        ]
      }
    }
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
