import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-open-send-report-popup',
  templateUrl: './open-send-report-popup.component.html',
  styleUrls: ['./open-send-report-popup.component.scss']
})
export class OpenSendReportPopupComponent implements OnInit {
  sendReport: any;

  constructor(public dialogRef: MatDialogRef<OpenSendReportPopupComponent>, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService, ) {
  }

  ngOnInit() {
  }

  getdataForm(data) {
    this.sendReport = this.fb.group({
    });
  }

  getFormControl(): any {
    return this.sendReport.controls;
  }

  procced() {
    this.dialogRef.close('');
  }

  onNoClick(value): void {
      this.dialogRef.close('');
    
  }
}