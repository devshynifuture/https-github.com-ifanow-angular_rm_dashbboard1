import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-add-kvp',
  templateUrl: './add-kvp.component.html',
  styleUrls: ['./add-kvp.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddKvpComponent implements OnInit {
  inputData: any;
  advisorId: any;
  clientId: any;
  familyMemberId: any;
  ownerName: any;
  editApi: any;
  ownerData: any;
  isOptionalField: boolean;
  KVPFormScheme: any;
  KVPOptionalFormScheme: any;

  constructor(private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }
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
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  get data() {
    return this.inputData;
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
    this.KVPFormScheme = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      amtInvested: [data.amountInvested, [Validators.required]],
      commDate: [data.commencementDate, [Validators.required]],
      ownerType: [data.ownershipTypeId, [Validators.required]],
    })
    this.KVPOptionalFormScheme = this.fb.group({
      poBranch: [, [Validators.required]],
      nominee: [, [Validators.required]],
      bankAccNum: [, [Validators.required]],
      description: [data.description, [Validators.required]],
    })
    this.ownerData = this.KVPFormScheme.controls;
  }

  addKVP() {
    if (this.ownerName == undefined) {
      return
    }
    else if (this.KVPFormScheme.get('amtInvested').invalid) {
      return
    }
    else if (this.KVPFormScheme.get('commDate').invalid) {
      return
    }
    else if (this.KVPFormScheme.get('ownerType').invalid) {
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
          "nomineeName": this.KVPOptionalFormScheme.get('nominee').value,
          "bankAccountNumber": this.KVPOptionalFormScheme.get('bankAccNum').value,
          "description": this.KVPOptionalFormScheme.get('description').value
        }
      if (this.editApi) {
        obj['id']=this.editApi.id
        this.cusService.editKVP(obj).subscribe(
          data => this.addKVPResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
      else {
        this.cusService.addKVP(obj).subscribe(
          data => this.addKVPResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
    }
  }
  addKVPResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("KVP is edited", "dismiss") : this.eventService.openSnackBar("KVP is edited", "added")
   console.log(data)
   this.close();
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
