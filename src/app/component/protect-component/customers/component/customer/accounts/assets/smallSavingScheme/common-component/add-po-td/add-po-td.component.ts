import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-po-td',
  templateUrl: './add-po-td.component.html',
  styleUrls: ['./add-po-td.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoTdComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ownerData: any;
  POTDForm: any;
  POTDOptionalForm: any;
  advisorId: any;
  isOptionalField: any;
  transactionData: any;
  editApi: any;
  clientId: any;
  nomineesListFM: any;
  nomineesList: any;
  nominees: any[];
  potdData: any;
  flag: any;

  constructor(public utils: UtilService, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject) { }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  display(value) {
    console.log('value selected', value)
    this.ownerName = value;
    this.familyMemberId = value.id
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
      this.editApi = data;
    }
    this.potdData = data;
    this.POTDForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(200)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      description: [data.description, [Validators.required]],

      tenure: [(data.tenure) ? data.tenure : '5', [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]]
    })
    this.POTDOptionalForm = this.fb.group({
      poBranch: [],
      nominee: [],
      tdNum: [data.tdNumber],
      bankAccNum: [],
      description: [data.description],
      id: [data.id]
    })
    this.ownerData = this.POTDForm.controls;

  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  ngOnInit() {
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.isOptionalField = true
  }
  getFormData(data) {
    console.log(data)
    this.transactionData = data.controls
  }
  addPOTD() {
    let finalTransctList = []
    if (this.transactionData) {

      this.transactionData.forEach(element => {
        let obj = {
          "date": element.controls.date.value,
          "amount": element.controls.amount.value,
          "paymentType": element.controls.transactionType.value
        }
        finalTransctList.push(obj)
      });
    }
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
    if (this.POTDForm.get('ownerName').invalid) {
      this.POTDForm.get('ownerName').markAsTouched();
      return;
    } else if (this.POTDForm.get('amtInvested').invalid) {
      this.POTDForm.get('amtInvested').markAsTouched();
      return
    } else if (this.POTDForm.get('ownerName').invalid) {
      this.POTDForm.get('ownerName').markAsTouched();
      return;
    }
    else if (this.POTDForm.get('commDate').invalid) {
      this.POTDForm.get('commDate').markAsTouched();
      return
    }
    else if (this.POTDForm.get('tenure').invalid) {
      this.POTDForm.get('tenure').markAsTouched();
      return
    }
    else if (this.POTDForm.get('ownershipType').invalid) {
      this.POTDForm.get('ownershipType').markAsTouched();
      return
    }
    else {
      if (this.editApi != undefined && this.editApi != 'advicePOTD') {
        let obj = {

          "familyMemberId": this.familyMemberId,
          "ownerName": (this.ownerName == null) ? this.POTDForm.controls.ownerName.value : this.ownerName,
          "amountInvested": this.POTDForm.get('amtInvested').value,
          "commencementDate": this.POTDForm.get('commDate').value,
          "tenure": this.POTDForm.get('tenure').value,
          "postOfficeBranch": this.POTDOptionalForm.get('poBranch').value,
          "ownerTypeId": this.POTDForm.get('ownershipType').value,
          "nominees": this.nominees,
          "tdNumber": this.POTDOptionalForm.get('tdNum').value,
          "bankAccountNumber": this.POTDOptionalForm.get('bankAccNum').value,
          "description": this.POTDOptionalForm.get('description').value,
          "id": this.POTDOptionalForm.get('id').value
        }
        this.cusService.editPOTD(obj).subscribe(
          data => this.response(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        let obj = {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": (this.ownerName == null) ? this.POTDForm.controls.ownerName.value : this.ownerName,
          "amountInvested": this.POTDForm.get('amtInvested').value,
          "commencementDate": this.POTDForm.get('commDate').value,
          "tenure": this.POTDForm.get('tenure').value,
          "postOfficeBranch": this.POTDOptionalForm.get('poBranch').value,
          "ownerTypeId": this.POTDForm.get('ownershipType').value,
          "nominees": this.nominees,
          "tdNumber": this.POTDOptionalForm.get('tdNum').value,
          "bankAccountNumber": this.POTDOptionalForm.get('bankAccNum').value,
          "description": this.POTDOptionalForm.get('description').value,
        }
        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        if (this.flag == 'advicePOTD') {
          this.cusService.getAdvicePord(adviceObj).subscribe(
            data => this.getAdvicePotdRes(data),
            err => this.eventService.openSnackBar(err, "dismiss")
          );
        } else {
          this.cusService.addPOTD(obj).subscribe(
            data => this.response(data),
            error => this.eventService.showErrorMessage(error)
          )
        }
      }
    }
  }
  getAdvicePotdRes(data) {
    this.eventService.openSnackBar("PO_TD is added", "added");
    this.close(true);

  }
  response(data) {
    (this.editApi) ? this.eventService.openSnackBar("PO_TD is edited", "dismiss") : this.eventService.openSnackBar("PO_TD is added", "added")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

}
