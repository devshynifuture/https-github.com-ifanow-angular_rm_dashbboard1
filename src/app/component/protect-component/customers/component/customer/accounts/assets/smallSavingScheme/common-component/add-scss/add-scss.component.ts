import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth-service/authService';
import { CustomerService } from '../../../../../customer.service';
import { EventService } from 'src/app/Data-service/event.service';
import { SubscriptionInject } from 'src/app/component/protect-component/AdviserComponent/Subscriptions/subscription-inject.service';
import { MAT_DATE_FORMATS } from '@angular/material';
import { MY_FORMATS2 } from 'src/app/constants/date-format.constant';
import { UtilService, ValidatorType } from 'src/app/services/util.service';
import { AssetValidationService } from './../../../asset-validation.service';

@Component({
  selector: 'app-add-scss',
  templateUrl: './add-scss.component.html',
  styleUrls: ['./add-scss.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS2 },
  ]
})
export class AddScssComponent implements OnInit {
  validatorType = ValidatorType
  maxDate = new Date();
  inputData: any;
  familyMemberId: any;
  ownerName: any;
  scssSchemeForm: any;
  scssOptionalSchemeForm: any;
  advisorId: any;
  clientId: number;
  ownerData: any;
  isOptionalField: any;
  editApi: any;
  nomineesListFM: any;
  scssData: any;
  nomineesList: any[] = [];
  nominees: any[];
  flag: any;

  @Input() popupHeaderText: string = 'Add Senior citizen savings scheme (SCSS)';
  adviceShowHeaderAndFooter: boolean = true;

  constructor(private subInjectService: SubscriptionInject, private fb: FormBuilder,
    private cusService: CustomerService, private eventService: EventService, public utils: UtilService) {
  }

  ngOnInit() {
    if (this.data && this.data.flag) {
      this.adviceShowHeaderAndFooter = false;
    } else {
      this.adviceShowHeaderAndFooter = true;
    }
    this.advisorId = AuthService.getAdvisorId();
    this.clientId = AuthService.getClientId();

    this.getdataForm(this.data);
    this.isOptionalField = true;
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
    this.nomineesListFM = Object.assign([], this.utils.calculateAgeFromCurrentDate(value.familyMembersList));
  }
  getFormDataNominee(data) {
    console.log(data)
    this.nomineesList = data.controls
  }
  getdataForm(data) {
    if (data == undefined) {
      data = {};
      this.flag = "addSCSS";
    } else {
      (data.assetDataOfAdvice) ? data = data.assetDataOfAdvice : this.editApi = data;
      this.flag = "editSCSS";
    }
    this.scssData = data;
    this.scssSchemeForm = this.fb.group({
      ownerName: [!data.ownerName ? '' : data.ownerName, [Validators.required, AssetValidationService.ageValidators(60)]],
      amtInvested: [data.amountInvested, [Validators.required, Validators.min(1000), Validators.max(1500000)]],
      commDate: [new Date(data.commencementDate), [Validators.required]],
      ownershipType: [(data.ownerTypeId) ? String(data.ownerTypeId) : '2', [Validators.required]]
    });
    this.scssOptionalSchemeForm = this.fb.group({
      poBranch: [data.postOfficeBranch],
      nominees: this.nominees,
      bankAccNumber: [data.bankAccountNumber],
      description: [data.description]
    });
    this.ownerData = this.scssSchemeForm.controls;
    this.familyMemberId = data.familyMemberId
  }

  moreFields() {
    (this.isOptionalField) ? this.isOptionalField = false : this.isOptionalField = true;
  }

  addScss() {
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
    if (this.scssSchemeForm.invalid) {
      this.scssSchemeForm.markAllAsTouched();
    } else {
      const obj = {
        id: 0,
        clientId: this.clientId,
        familyMemberId: this.familyMemberId,
        advisorId: this.advisorId,
        ownerName: (this.ownerName == undefined) ? this.scssSchemeForm.controls.ownerName.value : this.ownerName.userName,
        amountInvested: this.scssSchemeForm.get('amtInvested').value,
        commencementDate: this.scssSchemeForm.get('commDate').value,
        postOfficeBranch: this.scssOptionalSchemeForm.get('poBranch').value,
        bankAccountNumber: this.scssOptionalSchemeForm.get('bankAccNumber').value,
        ownerTypeId: this.scssSchemeForm.get('ownershipType').value,
        nominees: this.nominees,
        description: this.scssOptionalSchemeForm.get('description').value
      };
      let adviceObj = {
        advice_id: this.advisorId,
        adviceStatusId: 5,
        stringObject: obj,
        adviceDescription: "manualAssetDescription"
      }
      if (this.flag == 'adviceSCSS') {
        this.cusService.getAdviceScss(adviceObj).subscribe(
          data => this.getAdviceScssRes(data),
          err => this.eventService.openSnackBar(err, "Dismiss")
        );
      } else if (this.flag == "editSCSS") {
        obj.id = this.editApi.id;
        this.cusService.editSCSSData(obj).subscribe(
          data => this.addScssResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      } else {
        this.cusService.addSCSSScheme(obj).subscribe(
          data => this.addScssResponse(data),
          error => this.eventService.showErrorMessage(error)
        );
      }
    }
  }
  getAdviceScssRes(data) {
    this.eventService.openSnackBar('Scss is added', "Dismiss");
    this.close(true);

  }
  addScssResponse(data) {
    console.log(data);
    this.close(true);
  }

  close(flag) {
    this.isOptionalField = true;
    this.subInjectService.changeNewRightSliderState({ state: 'close', refreshRequired: flag });
  }

  isFormValuesForAdviceValid() {
    if (this.scssSchemeForm.valid ||
      (this.scssSchemeForm.valid && this.scssOptionalSchemeForm.valid && this.nomineesList.length !== 0)) {
      return true
    } else {
      return false;
    }
  }
}
