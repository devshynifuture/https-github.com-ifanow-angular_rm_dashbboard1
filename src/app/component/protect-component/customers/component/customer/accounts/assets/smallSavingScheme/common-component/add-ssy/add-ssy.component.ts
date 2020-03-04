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

  @Input() popupHeaderText: string = 'Add Sukanya samriddhi yojana (SSY)';
  adviceShowHeaderAndFooter: boolean = true;

  constructor(public utils: UtilService, private eventService: EventService, private fb: FormBuilder, private subInjectService: SubscriptionInject, private cusService: CustomerService, private datePipe: DatePipe) { }

  @Input()
  set data(data) {
    this.inputData = data;
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
    if (data == undefined) {
      data = {};
      this.flag = "addSSY";
    }
    else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = "editSSY";
    }
    this.ssyData = data;
    this.ssySchemeForm = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      guardian: [data.guardianName, [Validators.required]],
      accBalance: [data.accountBalance, [Validators.required, Validators.min(250), Validators.max(150000)]],
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
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.clientId = AuthService.getClientId();
    this.isOptionalField = true
    this.advisorId = AuthService.getAdvisorId();
    this.getdataForm(this.data);
  }
  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true
  }
  getFormData(data) {
    console.log(data)
    this.commencementDate = this.ssySchemeForm.controls.commDate.value;
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
    if (this.ssySchemeForm.invalid) {
      for (let element in this.ssySchemeForm.controls) {
        console.log(element)
        if (this.ssySchemeForm.controls[element].invalid) {
          this.ssySchemeForm.controls[element].markAsTouched();
          return;
        }
      }
    }
    else {
      if (this.flag == 'editSSY') {
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
          "nominees": this.nominees,
          "ssyFutureContributionList": [{
            "futureApproxContribution": this.ssySchemeForm.get('futureAppx').value,
            "frequency": this.ssySchemeForm.get('futureAppx').value,
          }],
          "ssyTransactionList": finalTransctList
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
        if (this.flag == 'addSSY') {
          this.cusService.addSSYScheme(obj).subscribe(
            data => this.addSSYSchemeResponse(data),
            error => this.eventService.showErrorMessage(error)
          )
        } else {
          this.cusService.getAdviceSsy(adviceObj).subscribe(
            data => this.getAdviceSsyRes(data),
            err => this.eventService.openSnackBar(err, "Dismiss")
          );
        }

      }
    }
  }
  getAdviceSsyRes(data) {
    console.log(data);
    this.eventService.openSnackBar("SSY is added", "Dismiss");
    this.close(true)

  }
  addSSYSchemeResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar("SSY is edited", "Dismiss") : this.eventService.openSnackBar("SSY is added", "added")
    console.log(data)
    this.close(true)
  }

  close(flag) {
    this.isOptionalField = true
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
