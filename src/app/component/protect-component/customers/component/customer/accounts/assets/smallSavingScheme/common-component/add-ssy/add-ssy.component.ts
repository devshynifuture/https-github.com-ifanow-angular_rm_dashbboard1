import { Component, OnInit, Input } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-add-ssy',
  templateUrl: './add-ssy.component.html',
  styleUrls: ['./add-ssy.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddSsyComponent implements OnInit {
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ssySchemeForm: any;
  ssySchemeOptionalForm: any;
  ownerData: any;
  isOptionalField: boolean;
  advisorId: any;
  editApi: any;
  transactionData: any;
  clientId: any;

  constructor(private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  get data() {
    return this.inputData;
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    else {
      this.editApi = data
    }
    this.ssySchemeForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      guardian: [data.guardianName, [Validators.required]],
      accBalance: [data.accountBalance, [Validators.required]],
      balanceAsOn: [new Date(data.balanceAsOn), [Validators.required]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      futureAppx: [data.futureApproxContribution, [Validators.required]],
      frquency: [data.frequency ? String(data.frequency) : '1', [Validators.required]]
    })
    this.ssySchemeOptionalForm = this.fb.group({
      description: [data.description],
      linkedAcc: [data.linkedBankAccount],
      bankName: [data.bankName],
      nominee: [data.nomineeName],
      agentName: [data.agentName]
    })
    this.ownerData = this.ssySchemeForm.controls;

  }
  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormData(data) {
    console.log(data)
    this.transactionData = data.controls
  }

  addSSYScheme() {
    let finalTransctList = []
    if (this.transactionData) {
      this.transactionData.forEach(element => {
        let obj = {
          "date": element.controls.date.value._d,
          "amount": element.controls.amount.value,
          "paymentType": element.controls.transactionType.value
        }
        finalTransctList.push(obj)
      });
    }
    if (this.ssySchemeForm.get('guardian').invalid) {
      this.ssySchemeForm.get('guardian').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('accBalance').invalid) {
      this.ssySchemeForm.get('accBalance').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('balanceAsOn').invalid) {
      this.ssySchemeForm.get('balanceAsOn').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('commDate').invalid) {
      this.ssySchemeForm.get('commDate').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('futureAppx').invalid) {
      this.ssySchemeForm.get('futureAppx').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('frquency').invalid) {
      this.ssySchemeForm.get('frquency').markAsTouched();
      return
    }
    else {
      if (this.editApi) {
        let obj = {
          "id": this.editApi.id,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "accountBalance": this.ssySchemeForm.get('accBalance').value,
          "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
          "commencementDate": this.ssySchemeForm.get('commDate').value,
          "description": this.ssySchemeOptionalForm.get('description').value,
          "bankName": this.ssySchemeOptionalForm.get('bankName').value,
          "linkedBankAccount": this.ssySchemeOptionalForm.get('linkedAcc').value,
          "agentName": this.ssySchemeOptionalForm.get('agentName').value,
          "guardianName": this.ssySchemeForm.get('guardian').value,
        }
        this.cusService.editSSYData(obj).subscribe(
          data => this.addSSYSchemeResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
      else {
        let obj =
        {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "accountBalance": this.ssySchemeForm.get('accBalance').value,
          "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
          "commencementDate": this.ssySchemeForm.get('commDate').value,
          "description": this.ssySchemeOptionalForm.get('description').value,
          "bankName": this.ssySchemeOptionalForm.get('bankName').value,
          "linkedBankAccount": this.ssySchemeOptionalForm.get('linkedAcc').value,
          "agentName": this.ssySchemeOptionalForm.get('agentName').value,
          "guardianName": this.ssySchemeForm.get('guardian').value,
          "ssyFutureContributionList": [{
            "futureApproxContribution": this.ssySchemeForm.get('futureAppx').value,
            "frequency": this.ssySchemeForm.get('futureAppx').value,
            "nomineeName": this.ssySchemeOptionalForm.get('nominee').value
          }],
          "ssyTransactionList": finalTransctList
        }
        this.cusService.addSSYScheme(obj).subscribe(
          data => this.addSSYSchemeResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
    }
  }
  addSSYSchemeResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("SSY is edited", "dismiss") : this.eventService.openSnackBar("SSY is edited", "added")
    console.log(data)
    this.close()
  }

  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
