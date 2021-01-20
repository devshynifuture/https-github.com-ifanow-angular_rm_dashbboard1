import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportService } from '../../support.service';
import { AuthService } from 'src/app/auth-service/authService';
import { DatePipe } from '@angular/common';
import { EventService } from 'src/app/Data-service/event.service';

@Component({
  selector: 'app-convert-to-paid',
  templateUrl: './convert-to-paid.component.html',
  styleUrls: ['./convert-to-paid.component.scss']
})
export class ConvertToPaidComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConvertToPaidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private supportService: SupportService,
    private datePipe: DatePipe,
    private eventService: EventService
  ) { }
  maxDate = new Date();
  DateFrom: FormGroup;
  advisorId = AuthService.getAdvisorId();

  preventDefault(event) {
    event.perventDefault();
  }

  ngOnInit() {
    console.log(this.data)
    this.DateFrom = this.fb.group({
      convertDate: [, Validators.required]
    })
  }
  saveDate() {
    const obj = {
      "advisorId": this.data.advisorId,
      "paidUpto": this.datePipe.transform(this.DateFrom.get('convertDate').value, 'yyyy-MM-dd'),
    }
    this.supportService.convertToPaidDate(obj).subscribe(
      data => {
        console.log(data);
        this.dialogRef.close(true);
      },
      error => this.eventService.showErrorMessage(error)
    );
  }

  dialogClose(close) {
    if (close) {
      this.dialogRef.close(false);
    }
  }

}
