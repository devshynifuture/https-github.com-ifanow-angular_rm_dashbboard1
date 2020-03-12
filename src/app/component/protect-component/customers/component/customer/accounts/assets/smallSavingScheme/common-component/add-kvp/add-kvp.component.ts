import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
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
  nomineesList: any[] = [];
  nominees: any[];
  kvpData;
  flag: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  adviceShowHeaderAndFooter: boolean = true;
  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  @Input()
  set data(data) {
    this.inputData = data;
  }
  get data() {
    return this.inputData;
  }

  @Input() popupHeaderText: string = 'Add Kisan vikas patra (KVP)';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.getdataForm(this.data);
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
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {

    if (data == undefined) {
      data = {};
      this.flag = 'addKVP';
    }
    else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = 'editKVP'
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
    if (this.KVPFormScheme.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.KVPFormScheme.markAllAsTouched();
      return;
    }
    else {
      let obj =
      {
        "clientId": this.clientId,
        "advisorId": this.advisorId,
        "familyMemberId": this.familyMemberId,
        "ownerName": (this.ownerName == undefined) ? this.KVPFormScheme.controls.ownerName.value : this.ownerName,
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
          err => this.eventService.openSnackBar(err, "Dismiss")
        );
      } else if (this.flag == 'editKVP') {
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
    (this.editApi) ? this.eventService.openSnackBar("Updated successfully!", "Dismiss") : this.eventService.openSnackBar("Added successfully!", "added")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.KVPFormScheme.valid || (this.KVPFormScheme.valid && this.KVPOptionalFormScheme.valid)) {
      return true;
    } else {
      return false;
    }
  }
}
