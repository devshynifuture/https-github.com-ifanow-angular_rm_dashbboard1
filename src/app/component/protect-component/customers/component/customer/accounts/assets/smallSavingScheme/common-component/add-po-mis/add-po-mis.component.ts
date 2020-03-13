import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AssetValidationService } from '../../../asset-validation.service';
import { MatInput } from '@angular/material';

@Component({
  selector: 'app-add-po-mis',
  templateUrl: './add-po-mis.component.html',
  styleUrls: ['./add-po-mis.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ],
})
export class AddPoMisComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  show: boolean;
  _inputData: any;
  pomisForm: any;
  ownerData: any;
  ownerName: any;
  selectedFamilyData: any;
  isAmtValid: boolean;
  isDateValid: boolean;
  isTypeValid: boolean;
  advisorId: any;
  clientId: number;
  familyMemberId: any;
  nominees: any;
  nomineesList: any[] = [];
  nomineesListFM: any;
  pomisData: any;
  flag: any;
  editApi: any;
  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  adviceShowHeaderAndFooter: boolean = true;

  constructor(public utils: UtilService, private fb: FormBuilder, public subInjectService: SubscriptionInject,
    public custumService: CustomerService, public eventService: EventService) {
  }

  @Input()
  set data(inputData) {
    this._inputData = inputData;
  }

  get data() {
    return this._inputData;
  }

  @Input() popupHeaderText: string = 'Add Post office monthly income scheme (PO MIS)';

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();
    this.show = false;
    this.getPomisData(this.data);

  }

  close(flag) {
    // let data=this._inputData.loanTypeId;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  display(value) {
    console.log('value selected', value);
    this.ownerName = value;
    this.familyMemberId = value;
  }
  lisNominee(value) {
    console.log(value)
    this.nomineesListFM = Object.assign([], this.utils.calculateAgeFromCurrentDate(value.familyMembersList));
  }
  getPomisData(data) {
    this.flag = data;
    (!data) ? data = {} : (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : ''
    this.pomisData = data;
    if (data == undefined) {
      data = {};
    } else {
      this.editApi = data;
    }
    this.pomisForm = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required, AssetValidationService.ageValidators(10)]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(1500), Validators.max(450000)]],
      commencementdate: [new Date(data.commencementDate), [Validators.required]],
      tenure: [(data.tenure) ? data.tenure : '5', [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? data.ownerTypeId : '1', [Validators.required]],
      poBranch: [data.postOfficeBranch],
      nominees: [data.nominees],
      accNumber: [(data.bankAccountNumber)],
      description: [data.description],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]],

    });

    this.getFormControl().amtInvested.maxLength = 20;
    this.getFormControl().accNumber.maxLength = 20;
    this.familyMemberId = this.pomisForm.controls.familyMemberId.value,
      this.familyMemberId = this.familyMemberId[0];
    this.ownerData = this.pomisForm.controls;

  }

  getFormControl() {
    return this.pomisForm.controls;
  }
  getFormData(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  changeMaxValue(data) {
    // console.log(data.value)
    (data.value == 1) ? this.pomisForm.get('amtInvested').setValidators([Validators.max(450000)]) : this.pomisForm.get('amtInvested').setValidators([Validators.max(900000)])
  }
  saveFormData(state) {
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
    if (this.pomisForm.invalid) {
      this.inputs.find(input => !input.ngControl.valid).focus();
      this.pomisForm.markAllAsTouched();
    } else {
      if (this.editApi != 'Add' && this.editApi != 'advicePOMIS') {
        const editObj = {
          id: this._inputData.id,
          clientId: this.clientId,
          familyMemberId: this.familyMemberId.id,
          advisorId: this.advisorId,
          ownerName: this.ownerName.userName,
          amountInvested: this.pomisForm.controls.amtInvested.value,
          commencementDate: this.pomisForm.controls.commencementdate.value,
          postOfficeBranch: this.pomisForm.controls.poBranch.value,
          bankAccountNumber: this.pomisForm.controls.accNumber.value,
          ownerTypeId: this.pomisForm.controls.ownershipType.value,
          nominees: this.nominees,
          description: this.pomisForm.controls.description.value,
          // "createdDate":"2001-01-01"
        };
        this.custumService.editPOMIS(editObj).subscribe(
          data => this.editPOMISRes(data)
        );
      } else {
        const objToSend = {
          id: this._inputData.id,
          advisorId: this.advisorId,
          clientId: this.clientId,
          familyMemberId: this.familyMemberId.id,
          ownerName: this.ownerName.userName,
          amountInvested: this.pomisForm.controls.amtInvested.value,
          commencementDate: this.pomisForm.controls.commencementdate.value,
          postOfficeBranch: this.pomisForm.controls.poBranch.value,
          bankAccountNumber: this.pomisForm.controls.accNumber.value,
          ownerTypeId: this.pomisForm.controls.ownershipType.value,
          nominees: this.nominees,
          description: this.pomisForm.controls.description.value,
          // "createdDate":obj.createdDate,
        };
        let adviceObj = {
          advice_id: this.advisorId,
          adviceStatusId: 5,
          // stringObject: obj,
          adviceDescription: "manualAssetDescription"
        }
        // console.log('obj', obj);
        if (this.flag == 'advicePOMIS') {
          this.custumService.getAdvicePomis(adviceObj).subscribe(
            data => this.getAdvicePomisRes(data),
            err => this.eventService.openSnackBar(err, "Dismiss")
          );
        } else {
          this.custumService.addPOMIS(objToSend).subscribe(
            data => this.addPOMISRes(data),
            err => this.eventService.openSnackBar(err, "Dismiss")
          );
        }

      }
    }
  }
  getAdvicePomisRes(data) {
    this.eventService.openSnackBar('Pomis added successfully', 'OK');
    this.close(true);
  }
  addPOMISRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Added successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');

    }
  }

  editPOMISRes(data) {
    console.log(data);
    if (data) {
      console.log(data);
      this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: true });
      this.eventService.openSnackBar('Updated successfully!', 'OK');
    } else {
      this.eventService.openSnackBar('Error', 'Dismiss');
    }
  }

  showMore() {
    this.show = true;
  }

  showLess() {
    this.show = false;

  }
}
