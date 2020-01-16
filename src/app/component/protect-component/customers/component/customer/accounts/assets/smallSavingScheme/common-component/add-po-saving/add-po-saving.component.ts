import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth-service/authService';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DATE_FORMATS} from '@angular/material';
import {MY_FORMATS2} from 'src/app/constants/date-format.constant';
import {CustomerService} from '../../../../../customer.service';
import {EventService} from 'src/app/Data-service/event.service';
import {SubscriptionInject} from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import {UtilService} from 'src/app/services/util.service';

@Component({
  selector: 'app-add-po-saving',
  templateUrl: './add-po-saving.component.html',
  styleUrls: ['./add-po-saving.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2},
  ]
})
export class AddPoSavingComponent implements OnInit {
  isOptionalField: any;
  advisorId: any;
  clientId: number;
  inputData: any;
  ownerData: any;
  poSavingForm: any;
  ownerName: any;
  familyMemberId: any;
  poSavingOptionalForm: any;
  editApi: any;
  accBalance: number;
  nomineesListFM: any;
  posavingData: any;
  nomineesList: any;
  nominees: any[];

  constructor(public utils: UtilService,private fb: FormBuilder, private cusService: CustomerService,
              private eventService: EventService, private subInjectService: SubscriptionInject) {
  }

  @Input()
  set data(data) {
    this.inputData = data;
    this.getdataForm(data);
    this.accBalance = 1500000;
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
  changeAccountBalance(data) {
    (this.poSavingForm.get('ownershipType').value == 1) ? (this.accBalance = 1500000,
        this.poSavingForm.get('ownershipType').setValidators([Validators.max(1500000)])
    ) : this.accBalance = 200000;
  }

  ngOnInit() {
    this.isOptionalField = true;
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {
        ownerTypeId: 1
      };
    } else {
      this.editApi = data;
    }
    this.posavingData=data
    this.poSavingForm = this.fb.group({
      ownerName: [data.ownerName, [Validators.required]],
      accBal: [data.accountBalance, [Validators.required, Validators.min(50), Validators.max(1500000)]],
      balAsOn: [new Date(data.balanceAsOn), [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '1', [Validators.required]],
      familyMemberId: [[(data == undefined) ? '' : data.familyMemberId], [Validators.required]],

    });
    this.poSavingOptionalForm = this.fb.group({
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      bankAccNo: [data.acNumber],
      description: [data.description]
    });
    this.ownerData = this.poSavingForm.controls;
    this.familyMemberId = this.poSavingForm.controls.familyMemberId.value,
    this.familyMemberId = this.familyMemberId[0];
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  addPOSaving() {
    this.nominees = []
    if (this.nomineesList) {

      this.nomineesList.forEach(element => {
        let obj = {
          "name": element.controls.name.value,
          "sharePercentage": element.controls.sharePercentage.value,
          "id":element.id,
          "familyMemberId":element.familyMemberId
        }
        this.nominees.push(obj)
      });
    }
    if (this.poSavingForm.get('accBal').invalid) {
      this.poSavingForm.get('accBal').markAsTouched();
      return;
    } else if (this.poSavingForm.get('ownerName').invalid) {
      this.poSavingForm.get('ownerName').markAsTouched();
      return;
    } else if (this.poSavingForm.get('balAsOn').invalid) {
      this.poSavingForm.get('balAsOn').markAsTouched();
      return;
    } else if (this.poSavingForm.get('ownershipType').invalid) {
      this.poSavingForm.get('ownershipType').markAsTouched();
      return;
    } else {
      if (this.editApi) {
        const obj = {
          id: this.editApi.id,
          familyMemberId: this.familyMemberId,
          balanceAsOn: this.poSavingForm.get('balAsOn').value,
          accountBalance: this.poSavingForm.get('accBal').value,
          postOfficeBranch: this.poSavingOptionalForm.get('poBranch').value,
          ownerTypeId: this.poSavingForm.get('ownershipType').value,
          nominees: this.nominees,
          acNumber: this.poSavingOptionalForm.get('bankAccNo').value,
          description: this.poSavingOptionalForm.get('description').value,
          ownerName:  (this.ownerName == undefined) ? this.poSavingForm.controls.ownerName.value : this.ownerName
        };
        this.cusService.editPOSAVINGData(obj).subscribe(
          data => this.addPOSavingResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        const obj = {
          clientId: this.clientId,
          advisorId: this.advisorId,
          familyMemberId: this.familyMemberId,
          balanceAsOn: this.poSavingForm.get('balAsOn').value,
          accountBalance: this.poSavingForm.get('accBal').value,
          postOfficeBranch: this.poSavingOptionalForm.get('poBranch').value,
          ownerTypeId: this.poSavingForm.get('ownershipType').value,
          nominees: this.nominees,
          acNumber: this.poSavingOptionalForm.get('bankAccNo').value,
          description: this.poSavingOptionalForm.get('description').value,
          ownerName: this.ownerName
        };
        this.cusService.addPOSAVINGScheme(obj).subscribe(
          data => this.addPOSavingResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      }
    }
  }

  addPOSavingResponse(data) {
    this.close(true);
    console.log(data);
    (this.editApi) ? this.eventService.openSnackBar('PO_SAVING is edited', 'dismiss') : this.eventService.openSnackBar('PO_SAVING is edited', 'added');

  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({state: 'close',refreshRequired:flag});
  }
}
