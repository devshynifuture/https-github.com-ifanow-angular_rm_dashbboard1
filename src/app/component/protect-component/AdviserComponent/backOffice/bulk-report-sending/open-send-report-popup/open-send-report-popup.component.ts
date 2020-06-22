import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackOfficeService } from '../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';

@Component({
  selector: 'app-open-send-report-popup',
  templateUrl: './open-send-report-popup.component.html',
  styleUrls: ['./open-send-report-popup.component.scss'],
})
export class OpenSendReportPopupComponent implements OnInit {
  sendReport: any;
  clientsSend: any;
  advisorId: any;
  dataClients: { clientId: number; };

  constructor(public dialogRef: MatDialogRef<OpenSendReportPopupComponent>,
    private fb: FormBuilder,
    private backOfficeService: BackOfficeService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService, ) {

    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    console.log('reportType', this.data)
    this.sendClientId()
  }

  sendClientId() {
    this.dataClients = {
      clientId: 97118
    }
    const obj = {
      advisorId: 5125,
      reportTypeId: 1
    };
    this.backOfficeService.getClientIdByLoop(obj).subscribe(
      data => {
        console.log('getClientIdByLoop ==', data)
      }
    );
    this.getDetails(this.dataClients)
  }
  getDetails(data) {
    const obj = {
      clientId: data.clientId,
      advisorId: this.advisorId,
    };
    this.backOfficeService.getDetailsClientAdvisor(obj).subscribe(
      data => this.getDetailsClientAdvisorRes(data)
    );
  }
  getDetailsClientAdvisorRes(data) {
    console.log('data', data)
    this.clientsSend = {
      userInfo: data,
      clientId: this.dataClients.clientId,
      mode: this.data.reportType,
      fromDate: this.data.selectedElement.fromDate,
      toDate: this.data.selectedElement.toDate,
      from: this.data.selectedElement.from,
      to: this.data.selectedElement.to,
    }
  }
  procced() {
    this.dialogRef.close('');
  }

  onNoClick(value): void {
    this.dialogRef.close('');

  }
}