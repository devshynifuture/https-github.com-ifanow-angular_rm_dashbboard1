import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-po-rd',
  templateUrl: './add-po-rd.component.html',
  styleUrls: ['./add-po-rd.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddPoRdComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  isOptionalField: any;
  inputData: any;
  ownerName: any;
  familyMemberId: any;
  advisorId: any;
  clientId: number;
  ownerData: any;
  PORDForm: any;
  PORDFormoptionalForm: any;
  editApi: any;
  nomineesListFM: any;
  pordData: any;
  nomineesList: any;
  nominees: any[];
  flag: any;

  constructor(public utils: UtilService, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService,
    private subInjectService: SubscriptionInject) {
  }

  ngOnInit() {
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
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
    console.log('value selected', value);
    this.ownerName = value;
    this.familyMemberId = value.id;
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
    } else {
      this.editApi = data;
    }
    this.pordData = data;
    this.PORDForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      monthlyContribution: [data.monthlyContribution, [Validators.required, Validators.min(10)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '3'],
      ownership: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]]
    });
    this.PORDFormoptionalForm = this.fb.group({
      rdNum: [data.rdNumber],
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      linkedBankAcc: [],
      description: [data.description]
    });
    this.ownerData = this.PORDForm.controls;

  }

  addPORD() {
    this.nominees = []
    if (this.nomineesList) {

      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id": element.controls.id.value,
          "familyMemberId": element.controls.familyMemberId.value
        }
        this.nominees.push(obj)
      });
    }
    if (this.PORDForm.get('ownerName').invalid) {
      this.PORDForm.get('ownerName').markAsTouched();
      return;
    } else if (this.PORDForm.get('monthlyContribution').invalid) {
      this.PORDForm.get('monthlyContribution').markAsTouched();
      return;
    } else if (this.PORDForm.get('ownerName').invalid) {
      this.PORDForm.get('ownerName').markAsTouched();
      return;
    } else if (this.PORDForm.get('commDate').invalid) {
      this.PORDForm.get('commDate').markAsTouched();
      return;
    } else if (this.PORDForm.get('ownership').invalid) {
      this.PORDForm.get('ownership').markAsTouched();
      return;
    } else {
      if (this.editApi != undefined && this.editApi != 'advicePORD') {
        const obj = {
          monthlyContribution: this.PORDForm.get('monthlyContribution').value,
          commencementDate: this.PORDForm.get('commDate').value,
          rdNumber: this.PORDFormoptionalForm.get('rdNum').value,
          postOfficeBranch: this.PORDFormoptionalForm.get('poBranch').value,
          ownerTypeId: this.PORDForm.get('ownership').value,
          nominees: this.nominees,
          description: this.PORDFormoptionalForm.get('description').value,
          isActive: 1,
          id: this.editApi.id

        };
        this.cusService.editPORD(obj).subscribe(
          data => this.addPORDResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        const obj = {
          clientId: this.clientId,
          advisorId: this.advisorId,
          familyMemberId: this.familyMemberId,
          ownerName: this.ownerName,
          monthlyContribution: this.PORDForm.get('monthlyContribution').value,
          commencementDate: this.PORDForm.get('commDate').value,
          rdNumber: this.PORDFormoptionalForm.get('rdNum').value,
          postOfficeBranch: this.PORDFormoptionalForm.get('poBranch').value,
          ownerTypeId: this.PORDForm.get('ownership').value,
          nominees: this.nominees,
          description: this.PORDFormoptionalForm.get('description').value

        };
        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        if (this.flag == 'advicePORD') {
          this.cusService.getAdvicePord(adviceObj).subscribe(
            data => this.getAdvicePordRes(data),
            err => this.eventService.openSnackBar(err, "dismiss")
          );
        } else {
          this.cusService.addPORDScheme(obj).subscribe(
            data => this.addPORDResponse(data),
            error => this.eventService.showErrorMessage(error)
          );
        }
      }
    }
  }
  getAdvicePordRes(data) {
    this.eventService.openSnackBar('PO_RD is added', 'added');
    this.close(true);
  }
  addPORDResponse(data) {
    (this.editApi) ? this.eventService.openSnackBar('PO_RD is edited', 'dismiss') : this.eventService.openSnackBar('PO_RD is added', 'added');
    console.log(data);
    this.close(true);
  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }
}
