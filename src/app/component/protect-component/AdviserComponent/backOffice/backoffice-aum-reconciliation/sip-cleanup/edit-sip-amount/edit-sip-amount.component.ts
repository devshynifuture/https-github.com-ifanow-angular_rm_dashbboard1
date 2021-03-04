import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorType } from 'src/app/services/util.service';
import { BackOfficeService } from '../../../back-office.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-edit-sip-amount',
  templateUrl: './edit-sip-amount.component.html',
  styleUrls: ['./edit-sip-amount.component.scss']
})
export class EditSipAmountComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private backofficeService: BackOfficeService,
    public dialogRef: MatDialogRef<EditSipAmountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private eventService: EventService) { }
  sipEdit: FormGroup;
  validatorType;
  ngOnInit() {
    this.validatorType = ValidatorType;
    this.sipEdit = this.fb.group({
      amount: [this.data.amount, [Validators.required]]
    })
  }
  sipEditSubmit() {
    if (this.sipEdit.invalid) {
      this.sipEdit.markAllAsTouched();
      return
    }
    const obj = {
      "id": this.data.id,
      "amount": this.sipEdit.controls.amount.value
    }
    this.backofficeService.editSipAmount(obj).subscribe(
      data => {
        if (data) {
          this.eventService.openSnackBar("SIP amount edited sucessfully", "Dismiss");
          this.close();
        }
      }, err => {
        this.eventService.openSnackBar(err, "Dismiss");
      }
    )
  }

  close() {
    this.dialogRef.close();
  }

}
