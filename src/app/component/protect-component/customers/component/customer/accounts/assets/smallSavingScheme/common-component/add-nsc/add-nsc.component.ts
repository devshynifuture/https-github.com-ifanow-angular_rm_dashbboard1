import { Component, OnInit, Input } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-nsc',
  templateUrl: './add-nsc.component.html',
  styleUrls: ['./add-nsc.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
    [DatePipe],
  ]
})
export class AddNscComponent implements OnInit {
  advisorId: any;
  inputData: any;
  ownerData: any;
  nscFormField: any;
  nscFormOptionalField: any;
  ownerName: any;
  familyMemberId: any;
  editApi: any;
  transactionData: any;
  commDate: any;
  clientId: any;
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  constructor(private datePipe: DatePipe,public utils: UtilService,private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  isOptionalField
  ngOnInit() {
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true

  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    else {
      this.editApi = data
      this.commDate = new Date(data.commencementDate)
    }
    this.nscFormField = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      amountInvested: [data.amountInvested, [Validators.required, Validators.min(100)]],
      commDate: [this.commDate, [Validators.required]],
      Tenure: [(data.tenure) ? String(data.tenure) : '5', [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]]

    })
    this.nscFormOptionalField = this.fb.group({
      cNo: [data.certificateNumber, [Validators.required]],
      poBranch: [data.postOfficeBranch, [Validators.required]],
      nominee: [data.nominee, [Validators.required]],
      linkedBankAccount: [data.bankAccountNumber, [Validators.required]],
      description: [data.description, [Validators.required]]
    })
    this.ownerData = this.nscFormField.controls;

  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  getFormData(data) {
    console.log(data)
    this.transactionData = data.controls
  }
  addNSC() {

    if (this.transactionData) {
      let finalTransctList = []
      this.transactionData.forEach(element => {
        let obj = {
          "date": element.controls.date.value._d,
          "amount": element.controls.amount.value,
          "paymentType": element.controls.transactionType.value
        }
        finalTransctList.push(obj)
      });
    }
    if (this.nscFormField.get('amountInvested').invalid) {
      this.nscFormField.get('amountInvested').markAsTouched();
      return
    }
    else if (this.nscFormField.get('commDate').invalid) {
      this.nscFormField.get('commDate').markAsTouched();
      return
    }
    else if (this.nscFormField.get('Tenure').invalid) {
      this.nscFormField.get('Tenure').markAsTouched();
      return
    }
    else if (this.nscFormField.get('ownershipType').invalid) {
      this.nscFormField.get('ownershipType').markAsTouched();
      return
    }
    else {
      if (this.editApi) {
        let obj =
        {
          "id": this.editApi.id,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.datePipe.transform(this.nscFormField.get('commDate').value,'yyyy-MM-dd'),
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormOptionalField.get('cNo').value,
          "postOfficeBranch": this.nscFormOptionalField.get('poBranch').value,
          "bankAccountNumber": this.nscFormOptionalField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominee": this.nscFormOptionalField.get('nominee').value,
          "description": this.nscFormOptionalField.get('description').value,
        }
        this.cusService.editNSCData(obj).subscribe(
          data => this.addNSCResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
      else {
        let obj =
        {
          "clientId": this.clientId,
          "familyMemberId": this.familyMemberId,
          "advisorId": this.advisorId,
          "ownerName": this.ownerName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.datePipe.transform(this.nscFormField.get('commDate').value,'yyyy-MM-dd'),
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormOptionalField.get('cNo').value,
          "postOfficeBranch": this.nscFormOptionalField.get('poBranch').value,
          "bankAccountNumber": this.nscFormOptionalField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominee": this.nscFormOptionalField.get('nominee').value,
          "description": this.nscFormOptionalField.get('description').value
        }
        console.log(obj)
        this.cusService.addNSCScheme(obj).subscribe(
          data => this.addNSCResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
    }
  }
  addNSCResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("NSC is edited", "dismiss") : this.eventService.openSnackBar("NSC is added", "dismiss")
    console.log(data)
    this.close()
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
