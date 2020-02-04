import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-exclusions',
  templateUrl: './manage-exclusions.component.html',
  styleUrls: ['./manage-exclusions.component.scss']
})
export class ManageExclusionsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ManageExclusionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }
  manageExclusionsForm
  ngOnInit() {
    console.log(this.data)
    this.manageExclusionsForm = this.fb.group({
      derivedAmount: [this.data.derivedAmount, [Validators.required]],
      availableAmount: [this.data.availableAmount, [Validators.required]],
      exclusionAmount: [this.data.exclusionToAssetBreakUp.exclusionAmount, [Validators.required]],
      exclusionReason: [this.data.exclusionToAssetBreakUp.exclusionReason, [Validators.required]]
    })
  }
  close() {
    this.dialogRef.close()
  }
}
