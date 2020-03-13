import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-amount',
  templateUrl: './add-amount.component.html',
  styleUrls: ['./add-amount.component.scss']
})
export class AddAmountComponent implements OnInit {
  addAmount: any;

  constructor(public dialogRef: MatDialogRef<AddAmountComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.getdataForm();
  }
  getdataForm() {
    this.addAmount = this.fb.group({
      amount:['', [Validators.required]]
    });
  }
  close() {
    this.dialogRef.close()
  }
  addExclusions(){
    // added for prod build
  }
}
