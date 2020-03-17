import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';

@Component({
  selector: 'app-select-asset-class',
  templateUrl: './select-asset-class.component.html',
  styleUrls: ['./select-asset-class.component.scss']
})
export class SelectAssetClassComponent implements OnInit {
  selectAsset: any;
  validatorType = ValidatorType

  constructor(public dialogRef: MatDialogRef<SelectAssetClassComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.getdataForm(this.data);
  }
  getdataForm(data) {
    this.selectAsset = this.fb.group({
      schemeName: [(!data) ? '' : this.data, [Validators.required]],
      amount:[(!data) ? '' : data.amount, [Validators.required]]
    });
  }
  close(flag) {
    this.dialogRef.close({isRefreshRequired:flag})
  }
}
