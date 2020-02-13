import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/component/protect-component/AdviserComponent/Activities/calendar/calendar.component';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { PlanService } from '../../plan.service';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-manage-exclusions',
  templateUrl: './manage-exclusions.component.html',
  styleUrls: ['./manage-exclusions.component.scss']
})
export class ManageExclusionsComponent implements OnInit {

  constructor(private eventService: EventService, private planService: PlanService, public dialogRef: MatDialogRef<ManageExclusionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) { }
  manageExclusionsForm
  ngOnInit() {
    console.log(this.data)
    this.manageExclusionsForm = this.fb.group({
      derivedAmount: [this.data.derivedAmount, [Validators.required]],
      availableAmount: [(this.data.derivedAmount - this.data.exclusionToAssetBreakUp.exclusionAmount), [Validators.required, this.availableAmountValidation()]],
      exclusionAmount: [this.data.exclusionToAssetBreakUp.exclusionAmount, [Validators.required]],
      exclusionReason: [this.data.exclusionToAssetBreakUp.exclusionReason, [Validators.required]]
    })
  }
  validatorType = ValidatorType

  availableAmountValidation() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (Math.sign(control.value) == -1) {
        return { numError: true }
      }
      return null;
    }
    // if (Math.sign(control.value) == -1) {
    //   return { numError: true }
    // }
    // return null;
  }
  addExclusions() {
    if (this.manageExclusionsForm.invalid) {
      for (let key in this.manageExclusionsForm.controls) {
        if (this.manageExclusionsForm.get(key).invalid) {
          this.manageExclusionsForm.get(key).markAsTouched();
          return false;
        }
      }
      return (this.manageExclusionsForm.valid) ? true : false;
    }
    else {
      let obj = {
        deploymentId: this.data.id,
        exclusionReason: this.manageExclusionsForm.get('exclusionReason').value,
        exclusionAmount: this.manageExclusionsForm.get('exclusionAmount').value
      }
      this.planService.addManageExclusive(obj).subscribe(
        data => {
          console.log(data);
          this.close();
        },
        err => this.eventService.openSnackBar(err, 'dismiss')
      )

    }
  }
  checkAvailableAmount() {
    this.manageExclusionsForm.get('availableAmount').setValue(this.manageExclusionsForm.get('derivedAmount').value - this.manageExclusionsForm.get('exclusionAmount').value);
  }
  calculateAvailableValue(data) {
    console.log(data)
  }
  close() {
    this.dialogRef.close()
  }
}
