import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-convert-to-paid',
  templateUrl: './convert-to-paid.component.html',
  styleUrls: ['./convert-to-paid.component.scss']
})
export class ConvertToPaidComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConvertToPaidComponent>,
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
