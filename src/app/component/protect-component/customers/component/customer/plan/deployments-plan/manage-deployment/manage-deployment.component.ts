import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ManageExclusionsComponent } from '../manage-exclusions/manage-exclusions.component';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { element } from 'protractor';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-deployment',
  templateUrl: './manage-deployment.component.html',
  styleUrls: ['./manage-deployment.component.scss']
})
export class ManageDeploymentComponent implements OnInit {
  assetAllcation: any;

  constructor(public dialogRef: MatDialogRef<ManageDeploymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.data)
    this.assetAllcation = this.fb.group({
      assetAllocationList: new FormArray([])
    })
    const { deploymentAssetBreakUp: { debtAmount, eqityAmount } } = this.data
    const newObj =
    {
      Equity: debtAmount,
      Dept: eqityAmount
    }
    for (let [key, value] of Object.entries(newObj)) {
      this.getAssetList.push(this.fb.group({
        name: [key, [Validators.required]],
        value: [value, [Validators.required]]
      }))
    }
  }
  get getAssetForm() { return this.assetAllcation.controls; }
  get getAssetList() { return this.getAssetForm.assetAllocationList as FormArray; }
  addAsset() {
    this.getAssetList.push(this.fb.group({
      name: [, [Validators.required]],
      value: [, [Validators.required]]
    }))
  }
  removeAsset(index) {
    this.assetAllcation.controls.assetAllocationList.removeAt(index)
  }
}
