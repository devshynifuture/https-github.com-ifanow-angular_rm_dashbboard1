import { Component, OnInit, Input } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-nsc',
  templateUrl: './add-nsc.component.html',
  styleUrls: ['./add-nsc.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
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
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  constructor(private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  isOptionalField
  ngOnInit() {
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
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
    }
    this.nscFormField = this.fb.group({
      ownerName: [String(data.ownerName), [Validators.required]],
      amountInvested: [data.amountInvested, [Validators.required]],
      commDate: [data.commencementDate, [Validators.required]],
      Tenure: [String(data.tenure), [Validators.required]],
      ownershipType: [String(data.ownerTypeId), [Validators.required]]

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
  addNSC() {
    if (this.ownerName == undefined) {
      return
    }
    else if (this.nscFormField.get('amountInvested').invalid) {
      return
    }
    else if (this.nscFormField.get('commDate').invalid) {

    }
    else if (this.nscFormField.get('Tenure').invalid) {

    }
    else if (this.nscFormField.get('ownershipType').invalid) {

    }
    else {
      if (this.editApi) {
        let obj =
        {
          "id": this.editApi.id,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.nscFormField.get('commDate').value._d,
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormOptionalField.get('cNo').value,
          "postOfficeBranch": this.nscFormOptionalField.get('poBranch').value,
          "bankAccountNumber": this.nscFormOptionalField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominee": this.nscFormOptionalField.get('nominee').value,
          "description": this.nscFormOptionalField.get('description').value,
          "createdDate": "2000-01-01"
        }
        this.cusService.editNSCData(obj).subscribe(
            data => this.addNSCResponse(data),
            err=>this.eventService.openSnackBar(err)
          )
      }
      else {
        let obj =
        {
          "clientId": 2978,
          "familyMemberId": this.familyMemberId,
          "advisorId": this.advisorId,
          "ownerName": this.ownerName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.nscFormField.get('commDate').value._d,
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
    console.log(data)
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
