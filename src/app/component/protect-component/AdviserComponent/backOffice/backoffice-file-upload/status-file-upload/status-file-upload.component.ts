import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth-service/authService';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-status-file-upload',
  templateUrl: './status-file-upload.component.html',
  styleUrls: ['./status-file-upload.component.scss']
})
export class StatusFileUploadComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'Ok',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  displayedColumns: string[] = ['name', 'mfoverview', 'scripUniqueIdentifier', 'pan', 'date', 'portfolioName', 'quantity', 'amount', 'transactionType'];
  data: Array<any> = [{}, {}, {}];
  clientDetails = new MatTableDataSource(this.data);
  advisorId: any;
  constructor(public dialogRef: MatDialogRef<StatusFileUploadComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data1: DialogData, private eventService: EventService) {

    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    console.log(this.data1)
    if (this.data1.flag == 'holding') {
      this.displayedColumns = ['name', 'mfoverview', 'scripUniqueIdentifier', 'pan', 'date', 'portfolioName', 'quantity', 'amount',];
    }
  }
  close() {
    this.dialogRef.close()
  }
}
