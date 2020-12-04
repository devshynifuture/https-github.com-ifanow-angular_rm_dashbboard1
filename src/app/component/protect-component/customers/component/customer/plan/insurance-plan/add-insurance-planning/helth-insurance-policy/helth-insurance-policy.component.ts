import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { DatePipe } from '@angular/common';
import { PlanService } from '../../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';
import { AuthService } from 'src/app/auth-service/authService';
import { ValidatorType } from 'src/app/services/util.service';
import { ActiityService } from '../../../../customer-activity/actiity.service';
import { PeopleService } from 'src/app/component/protect-component/PeopleComponent/people.service';

@Component({
  selector: 'app-helth-insurance-policy',
  templateUrl: './helth-insurance-policy.component.html',
  styleUrls: ['./helth-insurance-policy.component.scss']
})
export class HelthInsurancePolicyComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SAVE',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
    // buttonIcon: {
    //   fontIcon: 'favorite'
    // }
  };
  healthInsurance: any;
  adviceHealthInsurance = [];
  showInsurance: DialogData;
  advice: any;
  showError = false;
  todayDate = new Date();
  insuranceData: any;
  adviseId: number;
  catObj: any;
  insuranceCategoryTypeId: any;
  adviseCategoryTypeMasterId: any;
  familyList: any;
  inputData: any;
  constructor(private peopleService: PeopleService, private activityService: ActiityService, private datePipe: DatePipe, private fb: FormBuilder, public dialogRef: MatDialogRef<HelthInsurancePolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private planService: PlanService, private eventService: EventService) { }
  adviceData = [{ value: 1, advice: 'Continue', selected: true },
  { value: 2, advice: 'Discontinue', selected: false },
  { value: 3, advice: 'Port policy', selected: false },
  { value: 4, advice: 'Increase sum assured', selected: false },
  { value: 5, advice: 'Decrease sum assured', selected: false },
  { value: 6, advice: 'Add members', selected: false },
  { value: 7, advice: 'Remove members', selected: false }]
  ngOnInit() {
    // this.getAllCategory();
    this.inputData = this.data.value;
    this.getListFamilyMem();
    this.getdataForm('')
    this.showInsurance = this.data.data;
    this.getCategoryId();
    if (this.data.data.smallHeading == 'life insurance') {
      this.adviceData = [{ value: 1, advice: 'Continue', selected: true },
      { value: 2, advice: 'Surrender', selected: false },
      { value: 3, advice: 'Stop paying premium', selected: false },
        // { value: 4, advice: 'Take loan', selected: false }

        // { value: 5, advice: 'Partial withdrawl', selected: false }
      ]
    } else {
      this.adviceData = [{ value: 1, advice: 'Continue', selected: true },
      { value: 2, advice: 'Discontinue', selected: false },
      { value: 3, advice: 'Port policy', selected: false },
      { value: 4, advice: 'Increase sum assured', selected: false },
      { value: 5, advice: 'Decrease sum assured', selected: false },
      { value: 6, advice: 'Add members', selected: false },
      { value: 7, advice: 'Remove members', selected: false }]
    }
    this.insuranceData = this.data.value.insurance ? this.data.value.insurance : this.data.value.insuranceDetails;
  }
  // getAllCategory() {
  //   // this.isLoading = true;
  //   // this.termDataSource = [{}, {}, {}];
  //   // this.traditionalDataSource = [{}, {}, {}];
  //   // this.ulipDataSource = [{}, {}, {}];
  //   this.activityService.getAllCategory('').subscribe(
  //     data => {
  //       this.catObj = data;
  //     }, (error) => {
  //       this.eventService.openSnackBar('error', 'Dismiss');
  //     }
  //   );
  // }
  getListFamilyMem() {

    const obj = {
      clientId: AuthService.getClientId(),
    };
    this.peopleService.getClientFamilyMemberListAsset(obj).subscribe(
      data => {
        this.familyList = data;
      }
    );
  }

  getCategoryId() {
    
    switch (this.showInsurance.insuranceType) {
      case 4:
        this.insuranceCategoryTypeId = 37
        this.adviseCategoryTypeMasterId = 4
        break;
      case 5:
        this.insuranceCategoryTypeId = 34
        this.adviseCategoryTypeMasterId = 4
        break;
      case 6:
        this.insuranceCategoryTypeId = 36
        this.adviseCategoryTypeMasterId = 4
        break;
      case 7:
        this.insuranceCategoryTypeId = 35
        this.adviseCategoryTypeMasterId = 4
        break;
      case 8:
        this.insuranceCategoryTypeId = 38
        this.adviseCategoryTypeMasterId = 4
        break;
      case 9: 
        this.insuranceCategoryTypeId = 39
        this.adviseCategoryTypeMasterId = 4
        break;
      case 10:
        this.insuranceCategoryTypeId = 40
        this.adviseCategoryTypeMasterId = 4
        break;
      default:
        if(this.inputData.insuranceSubTypeId == 1 ){
          this.adviseCategoryTypeMasterId = 3
          this.insuranceCategoryTypeId = 42
        }else if(this.inputData.insuranceSubTypeId == 2){
          this.adviseCategoryTypeMasterId = 3
          this.insuranceCategoryTypeId = 43
        }else if(this.inputData.insuranceSubTypeId == 3){
          this.adviseCategoryTypeMasterId = 3
          this.insuranceCategoryTypeId = 44
        }
        break;
    }
  }
  getdataForm(data) {

    this.healthInsurance = this.fb.group({
      selectAdvice: [(!data) ? 'Continue' : data.selectAdvice, [Validators.required]],
      adviceHeader: [!data ? 'Continue' : data.adviceHeader, [Validators.required]],
      adviceStatus: [(!data) ? '' : data.adviceStatus],
      adviceRationale: [(!data) ? '' : data.adviceRationale],
      adviceHeaderDate: [(!data) ? new Date() : new Date(data.adviceHeaderDate), [Validators.required]],
      implementationDate: [(!data) ? '' : new Date(data.implementationDate), [Validators.required]],
      amount: [, [Validators.required]],
      consent: [(!data) ? '1' : data.consent, [Validators.required]],
      nonFinAdvice: [(!data) ? '' : '',],
      famMember: [(!data) ? '' : '', [Validators.required]]
    });
    this.healthInsurance.controls['adviceStatus'].disable()
    if (this.healthInsurance.get('selectAdvice').value == 'Continue' || this.healthInsurance.get('selectAdvice').value == 'Stop paying premium'
      || this.healthInsurance.get('selectAdvice').value == 'Discontinue') {
      this.healthInsurance.get('amount').setErrors(null);
      this.healthInsurance.get('famMember').setErrors(null);
    }
    if (this.healthInsurance.get('selectAdvice').value == 'Surrender' || this.healthInsurance.get('selectAdvice').value == 'Port policy'|| this.healthInsurance.get('selectAdvice').value == 'Increase sum assured' || this.healthInsurance.get('selectAdvice').value == 'Decrease sum assured') {
      this.healthInsurance.get('famMember').setErrors(null);
    }
  }
  getFormControl(): any {
    return this.healthInsurance.controls;
  }
  close(data, flag) {
    this.dialogRef.close({ data: data, isRefreshedRequired: flag })
  }
  setValue() {
    this.healthInsurance.get('adviceHeader').setValue(this.healthInsurance.get('selectAdvice').value);
    this.showError = false;
    this.healthInsurance.get('adviceHeader').setErrors(null);
    if (this.healthInsurance.get('selectAdvice').value == 'Continue' || this.healthInsurance.get('selectAdvice').value == 'Surrender' || this.healthInsurance.get('selectAdvice').value == 'Discontinue') {
      this.healthInsurance.get('amount').setErrors(null);
    }

  }
  dateChange(value) {
    let adviceHeaderDate = this.datePipe.transform(this.healthInsurance.controls.adviceHeaderDate.value, 'yyyy/MM/dd')
    console.log(adviceHeaderDate);
    let implementationDate = this.datePipe.transform(this.healthInsurance.controls.implementationDate.value, 'yyyy/MM/dd')
    if (adviceHeaderDate && implementationDate) {
      if (value == 'adviceHeaderDate') {
        if (implementationDate > adviceHeaderDate) {
          this.healthInsurance.get('adviceHeaderDate').setErrors();
        } else {
          this.healthInsurance.get('adviceHeaderDate').setErrors({ max: 'Date Issue' });
          this.healthInsurance.get('adviceHeaderDate').markAsTouched();
        }
      } else {
        if (implementationDate > adviceHeaderDate) {
          this.healthInsurance.get('implementationDate').setErrors();
        } else {
          this.healthInsurance.get('implementationDate').setErrors({ max: 'Date of repayment' });
          this.healthInsurance.get('implementationDate').markAsTouched();
        }

      }
    }


  }
  saveAdviceOnHealth() {
    if (this.healthInsurance.get('selectAdvice').value == 'Continue' || this.healthInsurance.get('selectAdvice').value == 'Stop paying premium'
      || this.healthInsurance.get('selectAdvice').value == 'Discontinue' ) {
      this.healthInsurance.get('amount').setErrors(null);
      this.healthInsurance.get('famMember').setErrors(null);
    }
    if (this.healthInsurance.get('selectAdvice').value == 'Surrender' || this.healthInsurance.get('selectAdvice').value == 'Port policy'|| this.healthInsurance.get('selectAdvice').value == 'Increase sum assured' || this.healthInsurance.get('selectAdvice').value == 'Decrease sum assured') {
      this.healthInsurance.get('famMember').setErrors(null);
    }
    if (this.healthInsurance.invalid) {
      this.healthInsurance.get('selectAdvice').value ? '' : this.showError = true;
      this.healthInsurance.markAllAsTouched();
    } else {
      this.barButtonOptions.active = true;
      // let obj = {
      //   selectAdvice: this.healthInsurance.controls.selectAdvice.value,
      //   adviceHeader: this.healthInsurance.controls.selectAdvice.value,
      //   adviceStatus: 'Given',
      //   adviceRationale: this.healthInsurance.controls.adviceRationale.value,
      //   adviceHeaderDate: this.healthInsurance.controls.adviceHeaderDate.value,
      //   implementationDate: this.healthInsurance.controls.implementationDate.value,
      //   consent: this.healthInsurance.controls.consent.value,
      // }
      this.getAdviseId(this.healthInsurance.get('selectAdvice').value);
      if(this.showInsurance.insuranceType && this.showInsurance.insuranceType > 3){
        let obj1 = {
          stringObject: { 
            'clientId': AuthService.getClientId(),
            'advisorId': AuthService.getAdvisorId(),
            'policyHolderId': this.insuranceData.policyHolderId,
            'policyStartDate': this.datePipe.transform(this.insuranceData.policyStartDate, 'yyyy-MM-dd'),
            'policyExpiryDate': this.datePipe.transform(this.insuranceData.policyExpiryDate, 'yyyy-MM-dd'),
            'cumulativeBonus': this.insuranceData.cumulativeBonus,
            'cumulativeBonusRupeesOrPercent': this.insuranceData.cumulativeBonusRupeesOrPercent,
            'policyTypeId': this.insuranceData.policyTypeId,
            'deductibleSumInsured': this.insuranceData.deductibleSumInsured,
            'exclusion': this.insuranceData.exclusion,
            'copay': this.insuranceData.copay,
            'planName': this.insuranceData.planName,
            'policyNumber': this.insuranceData.policyNumber,
            'copayRupeesOrPercent': this.insuranceData.copayRupeesOrPercent,
            'tpaName': this.insuranceData.tpaName,
            'advisorName': this.insuranceData.advisorName,
            'serviceBranch': this.insuranceData.serviceBranch,
            'linkedBankAccount': this.insuranceData.linkedBankAccount,
            'insurerName': this.insuranceData.insurerName,
            'policyInceptionDate': this.datePipe.transform(this.insuranceData.policyInceptionDate, 'yyyy-MM-dd'),
            'insuranceSubTypeId': this.showInsurance.insuranceType,
            'premiumAmount': this.insuranceData.premiumAmount,
            'policyFeatureId': this.insuranceData.policyFeatureId,
            'sumInsuredIdv': this.insuranceData.sumInsuredIdv,
            'id': (this.insuranceData.id) ? this.insuranceData.id : null,
            'addOns': [],
            insuredMembers: this.insuranceData.insuredMembers,
            nominees: this.insuranceData.nominees,
            "policyFeatures": this.insuranceData.policyFeatures,
            ccGvw: this.insuranceData.ccGvw,
            vehicleTypeId: this.insuranceData.vehicleTypeId,
            vehicleRegNo: this.insuranceData.vehicleRegNo,
            vehicleRegistrationDate: this.insuranceData.vehicleRegistrationDate,
            vehicleModel: this.insuranceData.vehicleModel,
            engineNo: this.insuranceData.engineNo,
            chasisNo: this.insuranceData.chasisNo,
            fuelTypeId: this.insuranceData.fuelTypeId,
            noClaimBonus: this.insuranceData.noClaimBonus,
            specialDiscount: this.insuranceData.specialDiscount,
            hypothetication: this.insuranceData.hypothetication,
            "geographyId": this.insuranceData.geographyId,
           },
          adviceDescription: this.healthInsurance.get('adviceRationale').value,
          insuranceCategoryTypeId: this.insuranceCategoryTypeId,
          adviseCategoryTypeMasterId: this.adviseCategoryTypeMasterId,
          suggestedFrom: 1,
          adviceId: this.adviseId,
          adviceAllotment: parseInt(this.healthInsurance.get('amount').value),
          realOrFictitious: 1,
          clientId: AuthService.getClientId(),
          advisorId: AuthService.getAdvisorId(),
          applicableDate: this.healthInsurance.get('implementationDate').value
        }
        this.planService.addAdviseOnGeneralInsurance(obj1).subscribe(
          res => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar("Advice given sucessfully", "Dimiss");
            this.close(this.advice, true);
          }, err => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, "Dimiss");
          }
        )
      }else{
        let obj1 = {
          stringObject: { id: this.insuranceData.id },
          adviceDescription: this.healthInsurance.get('adviceRationale').value,
          insuranceCategoryTypeId: this.insuranceCategoryTypeId,
          adviseCategoryTypeMasterId: this.adviseCategoryTypeMasterId,
          suggestedFrom: 1,
          adviceId: this.adviseId,
          adviceAllotment: parseInt(this.healthInsurance.get('amount').value),
          realOrFictitious: 1,
          clientId: AuthService.getClientId(),
          advisorId: AuthService.getAdvisorId(),
          applicableDate: this.healthInsurance.get('implementationDate').value
        }
        this.planService.addAdviseOnHealth(obj1).subscribe(
          res => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar("Advice given sucessfully", "Dimiss");
            this.close(this.advice, true);
          }, err => {
            this.barButtonOptions.active = false;
            this.eventService.openSnackBar(err, "Dimiss");
          }
        )
      }

      // this.adviceHealthInsurance.push(obj);
      // this.data.value.adviceValue = obj.selectAdvice;
      // this.advice = this.data.value
      // console.log('this.advice', this.adviceHealthInsurance)
    }
  }
  getAdviseId(name) {
    if (name == 'Continue') {
      this.adviseId = 1;
    }
    if (name == 'Discontinue' || name == 'Surrender') {
      this.adviseId = 2;
    }
    if (name == 'Port policy' || name == 'Stop paying premium') {
      this.adviseId = 3;
    }
    if (name == 'Increase sum assured') {
      this.adviseId = 4;
    }
    if (name == 'Decrease sum assured') {
      this.adviseId = 5;
    }
    if (name == 'Add members') {
      this.adviseId = 6;
    }
    if (name == 'Remove members') {
      this.adviseId = 7;
    }
  }
}
