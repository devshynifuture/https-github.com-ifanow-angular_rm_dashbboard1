import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SubscriptionService } from '../../AdviserComponent/Subscriptions/subscription.service';
import { EventService } from 'src/app/Data-service/event.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-replace-user',
  templateUrl: './replace-user.component.html',
  styleUrls: ['./replace-user.component.scss']
})
export class ReplaceUserComponent implements OnInit {
  user = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {}

  ngOnInit() {}

  clickNo() {
    if (this.dialogData.onNoClick) {
      this.dialogData.onNoClick();
      this.dialogClose();
    } else {
      this.dialogClose();
    }
  }

  clickYes() {
    if (this.user.valid) {
      this.dialogClose(this.user.value);
    } else {
      this.user.markAsTouched();
    }
  }

  dialogClose(result = false) {
    this.dialogRef.close(result);
  }
}
