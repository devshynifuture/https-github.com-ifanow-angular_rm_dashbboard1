import { Component, Input, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { FormBuilder, Validators } from '@angular/forms';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-ssy',
  templateUrl: './add-ssy.component.html',
  styleUrls: ['./add-ssy.component.scss'],
  providers: [
    [DatePipe],
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddSsyComponent implements OnInit {
  validatorType = ValidatorType;
  maxDate = new Date();
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  ssySchemeForm: any;
  ssySchemeOptionalForm: any;
  ownerData: any;
  isOptionalField: boolean;
  advisorId: any;
  editApi: any;
  transactionData: any;
  clientId: any;
  nomineesListFM: any;
  ssyData: any;
  nomineesList: any;
  nominees: any[];
  commencementDate: any;
  flag: any;

  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService, private datePipe: DatePipe) { }

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
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  setCommencementDate(date) {
    this.commencementDate = date
  }
  getdataForm(data) {
    this.flag = data;
    if (data == undefined) {
      data = {};
    }
    else {
      this.editApi = data
    }
    this.ssyData = data;
    this.ssySchemeForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      guardian: [data.guardianName, [Validators.required]],
      accBalance: [data.accountBalance, [Validators.required]],
      balanceAsOn: [new Date(data.balanceAsOn), [Validators.required]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      futureAppx: [data.futureApproxContribution, [Validators.required]],
      frquency: [data.frequency ? String(data.frequency) : '1', [Validators.required]]
    })
    this.ssySchemeOptionalForm = this.fb.group({
      description: [data.description],
      linkedAcc: [data.linkedBankAccount],
      bankName: [data.bankName],
      nominees: this.nominees,
      agentName: [data.agentName]
    })
    this.ownerData = this.ssySchemeForm.controls;
  }
  ngOnInit() {
    this.clientId = AuthService.getClientId();
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormData(data) {
    console.log(data)
    this.commencementDate = this.ssySchemeForm.controls.commencementDate.value;
    this.transactionData = data.controls
  }

  addSSYScheme() {
    let finalTransctList = []
    if (this.transactionData) {
      this.transactionData.forEach(element => {
        let obj = {
          "date": this.datePipe.transform(element.controls.date.value, 'yyyy-MM-dd'),
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
    if (this.ssySchemeForm.get('ownerName').invalid) {
      this.ssySchemeForm.get('ownerName').markAsTouched();
      return;
    } else if (this.ssySchemeForm.get('guardian').invalid) {
      this.ssySchemeForm.get('guardian').markAsTouched();
      return
    } else if (this.ssySchemeForm.get('ownerName').invalid) {
      this.ssySchemeForm.get('ownerName').markAsTouched();
      return;
    }
    else if (this.ssySchemeForm.get('accBalance').invalid) {
      this.ssySchemeForm.get('accBalance').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('balanceAsOn').invalid) {
      this.ssySchemeForm.get('balanceAsOn').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('commDate').invalid) {
      this.ssySchemeForm.get('commDate').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('futureAppx').invalid) {
      this.ssySchemeForm.get('futureAppx').markAsTouched();
      return
    }
    else if (this.ssySchemeForm.get('frquency').invalid) {
      this.ssySchemeForm.get('frquency').markAsTouched();
      return
    }
    else {
      if (this.editApi != undefined && this.editApi != 'adviceSSY') {
        let obj = {
          "id": this.editApi.id,
          "familyMemberId": this.familyMemberId,
          "ownerName": (this.ownerName == null) ? this.ssySchemeForm.controls.ownerName.value : this.ownerName,
          "accountBalance": this.ssySchemeForm.get('accBalance').value,
          "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
          "commencementDate": this.ssySchemeForm.get('commDate').value,
          "description": this.ssySchemeOptionalForm.get('description').value,
          "bankName": this.ssySchemeOptionalForm.get('bankName').value,
          "linkedBankAccount": this.ssySchemeOptionalForm.get('linkedAcc').value,
          "agentName": this.ssySchemeOptionalForm.get('agentName').value,
          "guardianName": this.ssySchemeForm.get('guardian').value,
          "nominees": this.nominees
        }
        this.cusService.editSSYData(obj).subscribe(
          data => this.addSSYSchemeResponse(data),
          error => this.eventService.showErrorMessage(error)
        )
      }
      else {
        let obj =
        {
          "clientId": this.clientId,
          "advisorId": this.advisorId,
          "familyMemberId": this.familyMemberId,
          "ownerName": (this.ownerName == null) ? this.ssySchemeForm.controls.ownerName.value : this.ownerName,
          "accountBalance": this.ssySchemeForm.get('accBalance').value,
          "balanceAsOn": this.ssySchemeForm.get('balanceAsOn').value,
          "commencementDate": this.ssySchemeForm.get('commDate').value,
          "description": this.ssySchemeOptionalForm.get('description').value,
          "bankName": this.ssySchemeOptionalForm.get('bankName').value,
          "linkedBankAccount": this.ssySchemeOptionalForm.get('linkedAcc').value,
          "agentName": this.ssySchemeOptionalForm.get('agentName').value,
          "guardianName": this.ssySchemeForm.get('guardian').value,
          "nominees": this.nominees,
          "ssyFutureContributionList": [{
            "futureApproxContribution": this.ssySchemeForm.get('futureAppx').value,
            "frequency": this.ssySchemeForm.get('futureAppx').value,
          }],
          "ssyTransactionList": finalTransctList
        }
        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        if (this.flag == 'adviceSSY') {
          this.cusService.getAdviceSsy(adviceObj).subscribe(
            data => this.getAdviceSsyRes(data),
            err => this.eventService.openSnackBar(err, "dismiss")
          );
        } else {
          this.cusService.addSSYScheme(obj).subscribe(
            data => this.addSSYSchemeResponse(data),
            error => this.eventService.showErrorMessage(error)
          )
        }

      }
    }
  }
  getAdviceSsyRes(data) {
    console.log(data);
    this.eventService.openSnackBar("SSY is added", "dismiss");
    this.close(true)

  }
  addSSYSchemeResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("SSY is edited", "dismiss") : this.eventService.openSnackBar("SSY is added", "added")
    console.log(data)
    this.close(true)
  }

  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
