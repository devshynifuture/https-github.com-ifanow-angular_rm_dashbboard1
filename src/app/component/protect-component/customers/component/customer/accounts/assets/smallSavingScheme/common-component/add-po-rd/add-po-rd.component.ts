import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';

@Component({
  selector: 'app-add-po-rd',
  templateUrl: './add-po-rd.component.html',
  styleUrls: ['./add-po-rd.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoRdComponent implements OnInit {
  isOptionalField: any;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  advisorId: typeof AuthService;
  ownerData: any;
  PORDForm: any;
  PORDFormoptionalForm: any;
  editApi: any;

  constructor(private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject) { }

  ngOnInit() {
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
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
    this.ownerName = value.userName;
    this.familyMemberId = value.id
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    else {
      this.editApi = data
    }
    this.PORDForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      monthlyContribution: [data.monthlyContribution, [Validators.required]],
      commDate: [data.commencementDate, [Validators.required]],
      ownership: [String(data.ownerTypeId), [Validators.required]]
    })
    this.PORDFormoptionalForm = this.fb.group({
      rdNum: [data.rdNumber],
      poBranch: [data.postOfficeBranch],
      nominee: [data.nominee],
      linkedBankAcc: [],
      description: [data.description]
    })
    this.ownerData = this.PORDForm.controls;

  }
  addPORD() {
    if (this.ownerName == undefined) {
      return
    }
    else if (this.PORDForm.get('monthlyContribution').invalid) {
      return
    }
    else if (this.PORDForm.get('commDate').invalid) {
      return
    }
    else if (this.PORDForm.get('ownership').invalid) {
      return
    }
    else {
      if (this.editApi) {
        let obj = {
          "monthlyContribution": this.PORDForm.get('monthlyContribution').value,
          "commencementDate": this.PORDForm.get('commDate').value,
          "rdNumber": this.PORDFormoptionalForm.get('rdNum').value,
          "postOfficeBranch": this.PORDFormoptionalForm.get('poBranch').value,
          "ownerTypeId":this.PORDForm.get('ownership').value,
          "nominee": this.PORDFormoptionalForm.get('nominee').value,
          "description":  this.PORDFormoptionalForm.get('description').value,
          "isActive": 1,
          "id": this.editApi.id

        }
        this.cusService.editPORD(obj).subscribe(
          data=>this.addPORDResponse(data),
          err=>this.eventService.openSnackBar(err)
        )
      }
      else {
        let obj = {
          "clientId": 2978,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "monthlyContribution": this.PORDForm.get('monthlyContribution').value,
          "commencementDate": this.PORDForm.get('commDate').value,
          "rdNumber": this.PORDFormoptionalForm.get('rdNum').value,
          "postOfficeBranch": this.PORDFormoptionalForm.get('poBranch').value,
          "ownerTypeId": this.PORDForm.get('ownership').value,
          "nominee": this.PORDFormoptionalForm.get('nominee').value,
          "description": this.PORDFormoptionalForm.get('description').value

        }
        this.cusService.addPORDScheme(obj).subscribe(
          data => this.addPORDResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
    }
  }
  addPORDResponse(data) {
    console.log(data)
    this.close();
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }
}
