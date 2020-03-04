import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';

@Component({
  selector: 'app-helth-insurance-policy',
  templateUrl: './helth-insurance-policy.component.html',
  styleUrls: ['./helth-insurance-policy.component.scss']
})
export class HelthInsurancePolicyComponent implements OnInit {
  healthInsurance: any;
  adviceHealthInsurance=[];
  showInsurance: DialogData;
  advice: any;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<HelthInsurancePolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  adviceData = [{ value: 1, advice: 'Continue' },
  {value: 2, advice:'Discontinue'},
  {value: 3, advice:'Port policy'},
  {value: 4, advice:'Increase sum assured'},
  {value: 5, advice:'Decrease sum assured'},
  {value: 6, advice:'Add members'},
  {value: 7, advice:'Remove members'}]
  ngOnInit() {
    this.getdataForm('')
    this.showInsurance = this.data.data
  }
  getdataForm(data) {

    this.healthInsurance = this.fb.group({
      selectAdvice: [(!data) ? '' : data.selectAdvice, [Validators.required]],
      adviceHeader: [data ? '' : data.adviceHeader, [Validators.required]],
      adviceStatus: [(!data) ? '' : data.adviceStatus, [Validators.required]],
      bypassConsent: [(!data) ? '' : data.bypassConsent, [Validators.required]],
      adviceRationale: [(!data) ? '' : data.adviceRationale, [Validators.required]],
      adviceHeaderDate: [(!data) ? '' : new Date(data.adviceHeaderDate), [Validators.required]],
      implementationDate: [(!data) ? '' : new Date(data.implementationDate), [Validators.required]],
      consent: [(!data) ? '' : data.consent, [Validators.required]],
    });
  }
  getFormControl(): any {
    return this.healthInsurance.controls;
  }
  close(){
    this.dialogRef.close(this.showInsurance)
  }
  saveAdviceOnHealth(){
    if (this.healthInsurance.get('selectAdvice').invalid) {
      this.healthInsurance.get('selectAdvice').markAsTouched();
      return;
    } else if (this.healthInsurance.get('adviceHeader').invalid) {
      this.healthInsurance.get('adviceHeader').markAsTouched();
      return;
    } else if (this.healthInsurance.get('adviceStatus').invalid) {
      this.healthInsurance.get('adviceStatus').markAsTouched();
      return
    } else if (this.healthInsurance.get('bypassConsent').invalid) {
      this.healthInsurance.get('bypassConsent').markAsTouched();
      return;
    } else if (this.healthInsurance.get('adviceRationale').invalid) {
      this.healthInsurance.get('adviceRationale').markAsTouched();
      return;
    }else if (this.healthInsurance.get('adviceHeaderDate').invalid) {
      this.healthInsurance.get('adviceHeaderDate').markAsTouched();
      return;
    }else if (this.healthInsurance.get('implementationDate').invalid) {
      this.healthInsurance.get('implementationDate').markAsTouched();
      return;
    } else if (this.healthInsurance.get('consent').invalid) {
      this.healthInsurance.get('consent').markAsTouched();
      return;
    }else {
    let obj = {
      selectAdvice:this.healthInsurance.controls.selectAdvice.value,
      adviceHeader:this.healthInsurance.controls.adviceHeader.value,
      adviceStatus:'Given',
      bypassConsent:this.healthInsurance.controls.bypassConsent.value,
      adviceRationale:this.healthInsurance.controls.adviceRationale.value,
      adviceHeaderDate:this.healthInsurance.controls.adviceHeaderDate.value,
      implementationDate:this.healthInsurance.controls.implementationDate.value,
      consent:this.healthInsurance.controls.consent.value,
    }
    this.adviceHealthInsurance.push(obj);
    this.data.value.adviceValue = obj.adviceHeader;
    this.advice = this.data.value
  }
    
    console.log('this.advice',this.adviceHealthInsurance)
    this.dialogRef.close(this.advice)
  }
}
