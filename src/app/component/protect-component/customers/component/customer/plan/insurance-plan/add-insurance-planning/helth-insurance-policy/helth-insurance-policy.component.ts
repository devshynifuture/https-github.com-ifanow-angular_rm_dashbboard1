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
  constructor(private datePipe: DatePipe, private fb: FormBuilder, public dialogRef: MatDialogRef<HelthInsurancePolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private planService: PlanService, private eventService: EventService) { }
  adviceData = [{ value: 1, advice: 'Continue', selected: true },
  { value: 2, advice: 'Discontinue', selected: false },
  { value: 3, advice: 'Port policy', selected: false },
  { value: 4, advice: 'Increase sum assured', selected: false },
  { value: 5, advice: 'Decrease sum assured', selected: false },
  { value: 6, advice: 'Add members', selected: false },
  { value: 7, advice: 'Remove members', selected: false }]
  ngOnInit() {
    this.getdataForm('')
    this.showInsurance = this.data.data;
    this.insuranceData = this.data.value.insurance
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
      nonFinAdvice: [(!data) ? '' : '', [Validators.required]]
    });
    this.healthInsurance.controls['adviceStatus'].disable()
  }
  getFormControl(): any {
    return this.healthInsurance.controls;
  }
  close() {
    this.dialogRef.close(this.showInsurance)
  }
  setValue() {
    this.healthInsurance.get('adviceHeader').setValue(this.healthInsurance.get('selectAdvice').value);
    this.showError = false;
    this.healthInsurance.get('adviceHeader').setErrors(null);

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
      let obj1 = {
        stringObject: { id: this.insuranceData.id },
        adviceDescription: this.healthInsurance.get('adviceRationale').value,
        insuranceCategoryTypeId: 42,
        suggestedFrom: 1,
        adviceId: this.adviseId,
        adviceAllotment: this.healthInsurance.get('amount').value,
        realOrFictitious: 1,
        clientId: AuthService.getClientId(),
        advisorId: AuthService.getAdvisorId(),
        adviseCategoryTypeMasterId: 2,
        applicableDate: this.healthInsurance.get('implementationDate').value
      }

      this.planService.addAdviseOnHealth(obj1).subscribe(
        res => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar("Advice given sucessfully", "Dimiss");
          this.dialogRef.close(this.advice);
        }, err => {
          this.barButtonOptions.active = false;
          this.eventService.openSnackBar(err, "Dimiss");
        }
      )
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
    if (name == 'Discontinue') {
      this.adviseId = 2;
    }
    if (name == 'Port policy') {
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
