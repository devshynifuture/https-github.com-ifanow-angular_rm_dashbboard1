import { DialogData } from './../../../../../../../common/link-bank/link-bank.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-date-change-dialog',
  templateUrl: './date-change-dialog.component.html',
  styleUrls: ['./date-change-dialog.component.scss']
})
export class DateChangeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DateChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) { }
  maxDate = new Date();
  ceasedForm: FormGroup;

  preventDefault(event) {
    event.perventDefault();
  }

  ngOnInit() {
    this.ceasedForm = this.fb.group({
      ceasedDate: [, Validators.required]
    })
  }

  dialogClose(close) {
    if (close) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close(this.ceasedForm.get('ceasedDate').value);
    }
  }
}
