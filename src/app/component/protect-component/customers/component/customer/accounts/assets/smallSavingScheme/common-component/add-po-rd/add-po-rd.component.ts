import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { AuthService } from 'src/app/auth-service/authService';
import { FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS, MatInput } from '@angular/material';
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
  nomineesList: any[] = [];
  nominees: any[];
  flag: any;
  multiplesOfFive: boolean = true;
  adviceShowHeaderAndFooter: boolean = true;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  constructor(public utils: UtilService, private fb: FormBuilder, private cusService: CustomerService, private eventService: EventService,
    private subInjectService: SubscriptionInject) {
  }

  @Input() popupHeaderText: string = 'Add Post office recurring deposit (PO RD)';

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

  numberMultiplesOfFive(event) {
    const val = event.target.value;
    if (val % 5 !== 0) {
      event.target.value = (Math.round(val / 5) + 1) * 5;
      this.multiplesOfFive = false;
    } else {
      event.target.value = val;
    }
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  @Input()
  set data(data) {
    this.inputData = data;
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
    if (data == undefined) {
      data = {};
      this.flag = "addPORD";
    } else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = "editPORD";
    }
    this.pordData = data;
    this.PORDForm = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required]],
      monthlyContribution: [data.monthlyContribution, [Validators.required, Validators.min(10)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '5', [Validators.required]],
      ownership: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]],
      interestRate: [!data.interestRate ? '7.2' : data.interestRate, [Validators.required]],
      compound: [(!data.compound) ? '3' : data.compound, [Validators.required]]
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

  onChange(event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = "100";
      this.PORDFormoptionalForm.get('interestRate').setValue(event.target.value);
    }
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
    if (this.PORDForm.invalid) {
      this.PORDForm.markAllAsTouched();
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
        nominees: this.nominees,
        description: this.PORDFormoptionalForm.get('description').value,
        interestRate: this.PORDForm.get('interestRate').value,
        ownerTypeId: this.PORDForm.get('ownership').value,
        interestCompounding: this.PORDForm.get('compound').value,
        isActive: 1,
        id: this.editApi.id
      };
      if (this.flag == "editPORD") {
        this.cusService.editPORD(obj).subscribe(
          data => this.addPORDResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        if (this.flag == 'advicePORD') {
          let adviceObj = {
            advice_id: this.advisorId,
            adviceStatusId: 5,
            stringObject: obj,
            adviceDescription: "manualAssetDescription"
          }
          this.cusService.getAdvicePord(adviceObj).subscribe(
            data => this.getAdvicePordRes(data),
            err => this.eventService.openSnackBar(err, "Dismiss")
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
    (this.flag = "editPORD") ? this.eventService.openSnackBar('PO_RD is edited', 'Dismiss') : this.eventService.openSnackBar('PO_RD is added', 'Dismiss');
    console.log(data);
    this.close(true);
  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.PORDForm.valid ||
      (this.PORDForm.valid && this.PORDFormoptionalForm.valid && this.nomineesList.length !== 0)) {
      return true;
    } else {
      return false;
    }
  }
}
