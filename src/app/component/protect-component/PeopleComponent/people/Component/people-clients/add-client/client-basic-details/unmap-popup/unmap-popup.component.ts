import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorType, UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-unmap-popup',
  templateUrl: './unmap-popup.component.html',
  styleUrls: ['./unmap-popup.component.scss']
})
export class UnmapPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UnmapPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder,
    private utilService: UtilService) { }
  unmapForm: FormGroup;
  validatorType = ValidatorType;

  ngOnInit() {
    this.unmapForm = this.fb.group({
      email: [this.data.fieldData.email ? this.data.fieldData.email : '', [Validators.required, Validators.pattern(this.validatorType.EMAIL)]],
      number: [this.data.fieldData.number ? this.data.fieldData.number : '', [Validators.required, Validators.pattern(this.validatorType.TEN_DIGITS)]],
      pan: [this.data.fieldData.pan ? this.data.fieldData.pan : '', [Validators.required, Validators.pattern(this.validatorType.PAN)]]
    })
  }

  unmapFamilyMember() {
    if (this.unmapForm.invalid) {
      this.unmapForm.markAllAsTouched();
    } else {
      const obj = this.unmapForm.value;
      this.dialogRef.close(obj)
    }
  }

  toUpperCase(formControl, event) {
    this.utilService.toUpperCase(formControl, event);
  }

  cancel() {
    this.dialogRef.close()
  }
}
