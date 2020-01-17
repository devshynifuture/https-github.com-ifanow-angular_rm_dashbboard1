import { EventService } from './../../../../../../../../../Data-service/event.service';
import { ValidatorType } from './../../../../../../../../../services/util.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cashflow-add',
  templateUrl: './cashflow-add.component.html',
  styleUrls: ['./cashflow-add.component.scss']
})
export class CashflowAddComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CashflowAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private eventService: EventService
  ) { }

  validatorType = ValidatorType;

  form = this.fb.group({
    "category": [, Validators.required],
    "amount": [, Validators.pattern(/\d+/)],
    "repeat-freq": [, Validators.required],
    "repeat-every": [, Validators.required],
    "starts-date": [, Validators.required],
    "starts-day": [, Validators.required],
    "continues-till": [, Validators.required],
    "continues-till-date": [, Validators.required],
    "payment-mode": [, Validators.required],
    "family-member": [, Validators.required]
  })


  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.form.invalid) {
      this.eventService.openSnackBar("Please solve required Fields", "DISMISS");
    } else {
      this.eventService.openSnackBar("Submitted Successfully!!", "OK");
      this.closeDialog();
    }
  }

}
