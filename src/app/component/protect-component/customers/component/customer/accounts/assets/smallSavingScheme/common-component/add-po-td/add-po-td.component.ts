import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-po-td',
  templateUrl: './add-po-td.component.html',
  styleUrls: ['./add-po-td.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoTdComponent implements OnInit {
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

  constructor(public utils: UtilService,private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService, private subInjectService: SubscriptionInject) { }
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
      this.editApi = data;
    }
    this.POTDForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(200)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      tenure: [data.tenure, [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]]
    })
    this.POTDOptionalForm = this.fb.group({
      poBranch: [],
      nominee: [],
      tdNum: [data.tdNumber],
      bankAccNum: [],
      description: [data.description]
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
    if (this.POTDForm.get('amtInvested').invalid) {
      this.POTDForm.get('amtInvested').markAsTouched();
      return
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
      if (this.editApi) {

      }
      else {
        let obj = {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": this.ownerName,
          "amountInvested": this.POTDForm.get('amtInvested').value,
          "commencementDate": this.POTDForm.get('commDate').value,
          "tenure": this.POTDForm.get('tenure').value,
          "postOfficeBranch": this.POTDOptionalForm.get('poBranch').value,
          "ownerTypeId": this.POTDForm.get('ownershipType').value,
          "nomineeName": this.POTDOptionalForm.get('nominee').value,
          "tdNumber": this.POTDOptionalForm.get('tdNum').value,
          "bankAccountNumber": this.POTDOptionalForm.get('bankAccNum').value,
          "description": this.POTDOptionalForm.get('description').value,
          "postOfficeTdTransactionList": finalTransctList
        }
        this.cusService.addPOTD(obj).subscribe(
          data => this.addPOTDResponse(data),
          err => this.eventService.openSnackBar(err)
        )
      }
    }
  }
  addPOTDResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("PO_TD is edited", "dismiss") : this.eventService.openSnackBar("PO_TD is edited", "added")
    console.log(data)
    this.close();
  }
  close() {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close' });
  }

}
