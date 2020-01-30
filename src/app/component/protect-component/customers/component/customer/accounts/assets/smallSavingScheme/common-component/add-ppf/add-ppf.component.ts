import {Component, Input, OnInit} from '@angular/core';
import {MAT_DATE_FORMATS} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {CustomerService} from '../../../../../customer.service';
import {AuthService} from 'src/app/auth-service/authService';
import {EventService} from 'src/app/Data-service/event.service';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-add-ppf',
  templateUrl: './add-ppf.component.html',
  styleUrls: ['./add-ppf.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ]
})
export class AddPpfComponent implements OnInit {
  maxDate = new Date();
  isOptionalField: boolean;
  advisorId: any;
  ownerName: any;
  familyMemberId: any;
  inputData: any;
  ownerData: any;
  ppfSchemeForm;
  transactionForm
  optionalppfSchemeForm;
  transactionList = [];
  addTransactionList: number;
  transactionData: any;
  editApi: any;
  clientId: number;
  nexNomineePer = 0;
  showError = false;
  nomineesListFM: any;
  dataFM: any;
  familyList: any;
  errorFieldName: string;
  nomineesList: any;
  ppfData: any;
  nominees: any[];
  commencementDate: any;
  constructor(public utils: UtilService,private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService) { }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
  }

  get data() {
    return this.inputData;
  }
  ngOnInit() {
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
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
  setCommencementDate(date){
    console.log('commencentDAte',date)
    this.commencementDate = date
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
    }
    else {
      this.editApi = data
    }
    this.ppfData=data;
    this.ppfSchemeForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      accountBalance: [data.accountBalance, [Validators.required, Validators.min(500)]],
      balanceAsOn: [new Date(data.balanceAsOn), [Validators.required]],
      commencementDate: [new Date(data.commencementDate), [Validators.required]],
      futureContribution: [data.futureApproxcontribution, [Validators.required]],
      frquency: [(data.frequency == undefined) ? "1" : data.frequency, [Validators.required]],
    })
    this.optionalppfSchemeForm = this.fb.group({
      description: [data.description, [Validators.required]],
      bankName: [data.bankName, [Validators.required]],
      linkedBankAccount: [data.linkedBankAccount, [Validators.required]],
      nominees: this.nomineesList
    })
    this.ownerData = this.ppfSchemeForm.controls;
  }
  get nominee() {
    return this.optionalppfSchemeForm.get('npsNomineesList') as FormArray;
  }
  check() {
    console.log(this.ppfSchemeForm)
  }

  getFormData(data) {
    console.log(data)
    this.commencementDate = this.ppfSchemeForm.controls.commencementDate.value;
    this.transactionData = data.controls
    return 
  }
  addPPF() {
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
    this.nominees = []
    if (this.nomineesList) {

      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id":(element.controls.id.value)?element.controls.id.value:0,
          "familyMemberId":(element.controls.familyMemberId.value)?element.controls.familyMemberId.value:0
        }
        this.nominees.push(obj)
      });
    }
    if (this.ppfSchemeForm.get('accountBalance').invalid) {
      this.ppfSchemeForm.get('accountBalance').markAsTouched();
      return;
    } else if (this.ppfSchemeForm.get('ownerName').invalid) {
      this.ppfSchemeForm.get('ownerName').markAsTouched();
      return;
    }
    else if (this.ppfSchemeForm.get('balanceAsOn').invalid) {
      this.ppfSchemeForm.get('balanceAsOn').markAsTouched();
      return;
    }
    else if (this.ppfSchemeForm.get('commencementDate').invalid) {
      this.ppfSchemeForm.get('commencementDate').markAsTouched();
      return;
    }
    else if (this.ppfSchemeForm.get('futureContribution').invalid) {
      this.ppfSchemeForm.get('futureContribution').markAsTouched();
      return;
    }
    else if (this.ppfSchemeForm.get('frquency').invalid) {
      this.ppfSchemeForm.get('frquency').markAsTouched();
      return;
    }
    else {
      let obj = {
        "advisorId": this.advisorId,
        "clientId": this.clientId,
        "ownerName": this.ownerName,
        "familyMemberId": this.familyMemberId,
        "accountBalance": this.ppfSchemeForm.get('accountBalance').value,
        "balanceAsOn": this.ppfSchemeForm.get('balanceAsOn').value,
        "commencementDate": this.ppfSchemeForm.get('commencementDate').value,
        "description": this.optionalppfSchemeForm.get('description').value,
        "bankName": this.optionalppfSchemeForm.get('bankName').value,
        "linkedBankAccount": this.optionalppfSchemeForm.get('linkedBankAccount').value,
        "nominees":this.nominees,
        "frequency": this.ppfSchemeForm.get('frquency').value,
        "futureApproxcontribution": this.ppfSchemeForm.get('futureContribution').value,
        "publicprovidendfundtransactionlist": finalTransctList,
      }
      if (this.editApi) {
        obj['id'] = this.editApi.id
        this.cusService.editPPF(obj).subscribe(
          data => this.addPPFResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        this.cusService.addPPFScheme(obj).subscribe(
          data => this.addPPFResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
    }
  }
  addPPFResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("PPF is edited", "dismiss") : this.eventService.openSnackBar("PPF is added", "dismiss")
    console.log(data)
    this.close(true);
  }
  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close',refreshRequired:flag});
  }

}
