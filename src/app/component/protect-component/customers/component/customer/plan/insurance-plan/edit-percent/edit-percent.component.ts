import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-percent',
  templateUrl: './edit-percent.component.html',
  styleUrls: ['./edit-percent.component.scss']
})
export class EditPercentComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EditPercentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }
  maxDate = new Date();
  percentageForm: FormGroup;

  preventDefault(event) {
    event.perventDefault();
  }

  ngOnInit() {
    this.percentageForm = this.fb.group({
      percent: [this.data.percent]
    })
  }
  onChange(form, value, event) {
    if (parseInt(event.target.value) > 100) {
      event.target.value = '100';
      form.get(value).setValue(event.target.value);
    }
  }

  dialogClose(close) {
    if (close) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close(this.percentageForm.get('percent').value);
    }
  }

}