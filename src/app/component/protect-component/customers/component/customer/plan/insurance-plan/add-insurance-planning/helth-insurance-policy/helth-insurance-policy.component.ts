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
    let obj = {
      selectAdvice:this.healthInsurance.controls.selectAdvice.value,
      adviceHeader:this.healthInsurance.controls.selectAdvice.value,
      adviceStatus:'Given',
      bypassConsent:this.healthInsurance.controls.bypassConsent.value,
      adviceRationale:this.healthInsurance.controls.adviceRationale.value,
      adviceHeaderDate:this.healthInsurance.controls.adviceHeaderDate.value,
      implementationDate:this.healthInsurance.controls.implementationDate.value,
      consent:this.healthInsurance.controls.consent.value,
    }
    this.adviceHealthInsurance.push(obj);
    console.log('this.advice',this.adviceHealthInsurance)
  }
}
