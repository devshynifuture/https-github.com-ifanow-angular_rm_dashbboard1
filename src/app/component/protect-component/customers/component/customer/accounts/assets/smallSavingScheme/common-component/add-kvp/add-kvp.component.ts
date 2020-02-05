import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-kvp',
  templateUrl: './add-kvp.component.html',
  styleUrls: ['./add-kvp.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddKvpComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  inputData: any;
  advisorId: any;
  clientId: any; Outstanding
  familyMemberId: any;
  ownerName: any;
  editApi: any;
  ownerData: any;
  isOptionalField: boolean;
  KVPFormScheme: any;
  KVPOptionalFormScheme: any;
  nomineesListFM: any;
  nomineesList: any;
  nominees: any[];
  kvpData;
  flag: any;
  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
  ngOnInit() {
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
  }
  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
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
  get data() {
    return this.inputData;
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
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
    }
    this.KVPFormScheme = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(1000)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      ownerType: [data.ownershipTypeId ? String(data.ownershipTypeId) : '1', [Validators.required]],
    })
    this.KVPOptionalFormScheme = this.fb.group({
      poBranch: [, [Validators.required]],
      nominees: this.nominees,
      bankAccNum: [, [Validators.required]],
      description: [data.description, [Validators.required]],
    })
    this.ownerData = this.KVPFormScheme.controls;
  }

  addKVP() {
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
    if (this.KVPFormScheme.get('ownerName').invalid) {
      this.KVPFormScheme.get('ownerName').markAsTouched();
      return;
    } else if (this.KVPFormScheme.get('amtInvested').invalid) {
      this.KVPFormScheme.get('amtInvested').markAsTouched();
      return
    } else if (this.KVPFormScheme.get('ownerName').invalid) {
      this.KVPFormScheme.get('ownerName').markAsTouched();
      return;
    }
    else if (this.KVPFormScheme.get('commDate').invalid) {
      this.KVPFormScheme.get('commDate').markAsTouched();
      return
    }
    else if (this.KVPFormScheme.get('ownerType').invalid) {
      this.KVPFormScheme.get('ownerType').invmarkAsTouched();
      return
    }
    else {
      let obj =
      {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "familyMemberId": this.familyMemberId,
        "ownerName": this.ownerName,
        "amountInvested": this.KVPFormScheme.get('amtInvested').value,
        "commencementDate": this.KVPFormScheme.get('commDate').value,
        "postOfficeBranch": this.KVPOptionalFormScheme.get('poBranch').value,
        "ownershipTypeId": this.KVPFormScheme.get('ownerType').value,
        "nominees": this.nominees,
        "bankAccountNumber": this.KVPOptionalFormScheme.get('bankAccNum').value,
        "description": this.KVPOptionalFormScheme.get('description').value
      }
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == 'adviceKVP') {
        this.cusService.getAdviceKvp(adviceObj).subscribe(
          data => this.getAdviceKvpRes(data),
          err => this.eventService.openSnackBar(err, "dismiss")
        );
      } else if (this.editApi != undefined && this.editApi != 'adviceKVP') {
        obj['id'] = this.editApi.id
        this.cusService.editKVP(obj).subscribe(
          data => this.addKVPResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        this.cusService.addKVP(obj).subscribe(
          data => this.addKVPResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
    }
  }
  getAdviceKvpRes(data) {
    console.log(data);
    this.eventService.openSnackBar("KVP is added", "ok")
    this.close(true);
  }
  addKVPResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("KVP is edited", "dismiss") : this.eventService.openSnackBar("KVP is added", "added")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
