import { Component, Input, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
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
  validatorType = ValidatorType
  maxDate = new Date();
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
  nomineesListFM: any;
  nscData: any;
  nomineesList: any;
  nominees: any;
  flag: any;
  dataSource: { "id": any; "familyMemberId": any; "ownerName": any; "amountInvested": any; "commencementDate": string; "tenure": any; "certificateNumber": any; "postOfficeBranch": any; "bankAccountNumber": any; "ownerTypeId": number; "nominees": any; "description": any; };
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  constructor(private datePipe: DatePipe, public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  isOptionalField
  ngOnInit() {
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true

  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], value.familyMembersList);
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {
    this.flag = data;
    if (data == undefined) {
      data = {};
    }
    else {
      this.editApi = data
      this.commDate = new Date(data.commencementDate)
    }
    this.nscData = data
    this.nscFormField = this.fb.group({
      ownerName: [!data.ownerName?'':data.ownerName, [Validators.required]],
      amountInvested: [data.amountInvested, [Validators.required, Validators.min(100)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      Tenure: [(data.tenure) ? String(data.tenure) : '5', [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]]
    })
    this.nscFormOptionalField = this.fb.group({
      cNo: [data.certificateNumber, [Validators.required]],
      poBranch: [data.postOfficeBranch, [Validators.required]],
      nominees: this.nominees,
      linkedBankAccount: [data.bankAccountNumber, [Validators.required]],
      description: [data.description, [Validators.required]]
    })
    this.ownerData = this.nscFormField.controls;
    this.familyMemberId = this.nscFormField.controls.familyMemberId.value
    this.familyMemberId = this.familyMemberId[0]

  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value;
    this.familyMemberId = value.id
  }
  // getFormData(data) {
  //   console.log(data)
  //   this.transactionData = data.controls
  // }
  addNSC() {
    this.nominees = []
    if (this.nomineesList) {

      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id": element.id,
          "familyMemberId": element.familyMemberId
        }
        this.nominees.push(obj)
      });
    }
    // if (this.transactionData) {
    //   let finalTransctList = []
    //   this.transactionData.forEach(element => {
    //     let obj = {
    //       "date": element.controls.date.value._d,
    //       "amount": element.controls.amount.value,
    //       "paymentType": element.controls.transactionType.value
    //     }
    //     finalTransctList.push(obj)
    //   });
    // }
    if (this.nscFormField.invalid) {
      this.nscFormField.get('ownerName').markAsTouched();
      this.nscFormField.get('amountInvested').markAsTouched();
      this.nscFormField.get('ownerName').markAsTouched();
      this.nscFormField.get('commDate').markAsTouched();
      this.nscFormField.get('Tenure').markAsTouched();
      this.nscFormField.get('ownershipType').markAsTouched();
    }
    else {
      if (this.editApi != undefined && this.editApi != 'adviceNSC') {
        let obj =
        {
          "id": this.editApi.id,
          "familyMemberId": this.familyMemberId,
          "ownerName": (this.ownerName == undefined) ? this.nscFormField.controls.ownerName.value : this.ownerName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.datePipe.transform(this.nscFormField.get('commDate').value, 'yyyy-MM-dd'),
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormOptionalField.get('cNo').value,
          "postOfficeBranch": this.nscFormOptionalField.get('poBranch').value,
          "bankAccountNumber": this.nscFormOptionalField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominees": this.nominees,
          "description": this.nscFormOptionalField.get('description').value,
        }
        this.cusService.editNSCData(obj).subscribe(
          data => this.addNSCResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        let obj =
        {
          "clientId": this.clientId,
          "familyMemberId": this.familyMemberId,
          "advisorId": this.advisorId,
          "ownerName": (this.ownerName == undefined) ? this.nscFormField.controls.ownerName.value : this.ownerName,
          "amountInvested": this.nscFormField.get('amountInvested').value,
          "commencementDate": this.datePipe.transform(this.nscFormField.get('commDate').value, 'yyyy-MM-dd'),
          "tenure": this.nscFormField.get('Tenure').value,
          "certificateNumber": this.nscFormOptionalField.get('cNo').value,
          "postOfficeBranch": this.nscFormOptionalField.get('poBranch').value,
          "bankAccountNumber": this.nscFormOptionalField.get('linkedBankAccount').value,
          "ownerTypeId": parseInt(this.nscFormField.get('ownershipType').value),
          "nominees": this.nominees,
          "description": this.nscFormOptionalField.get('description').value
        }
        console.log(obj)
        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        if (this.flag == 'adviceNSC') {
          this.cusService.getAdviceNsc(adviceObj).subscribe(
            data => this.getAdviceNscRes(data),
            err => this.eventService.openSnackBar(err, "dismiss")
          );
        } else {
          this.cusService.addNSCScheme(obj).subscribe(
            data => this.addNSCResponse(data),
            error => this.eventService.showErrorMessage(error)
          )
        }
      }
    }
  }
  getAdviceNscRes(data) {
    console.log(data);
    this.eventService.openSnackBar("NSC is added", "ok")
    this.close(true);
  }
  addNSCResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("NSC is edited", "dismiss") : this.eventService.openSnackBar("NSC is added", "dismiss")
    console.log(data)
    this.close(true)
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
