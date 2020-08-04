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
  setObj: {};
  callBulk: boolean = false;
  reportType: any;
  clientCount: any;

  constructor(public dialogRef: MatDialogRef<OpenSendReportPopupComponent>,
    private fb: FormBuilder,
    private backOfficeService: BackOfficeService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private eventService: EventService, ) {

    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    console.log('reportType', this.data)
    if (this.data.reportType == 'overview') {
      this.reportType = 1
    } else if (this.data.reportType == 'summary') {
      this.reportType = 2
    } else if (this.data.reportType == 'allTransactions') {
      this.reportType = 3
    } else if (this.data.reportType == 'unrealisedTransactions') {
      this.reportType = 4
    } else if (this.data.reportType == 'capitalGainSummary') {
      this.reportType = 5
    } else if (this.data.reportType == 'capitalGainDetails') {
      this.reportType = 6
    }
    this.sendNowCount()
  }

  sendClientId() {
    this.callBulk = true
    if (this.data.reportType == 'overview') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 1
      }
      this.reportType = 1
    } else if (this.data.reportType == 'summary') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 2,
        toDate: this.data.selectedElement.toDate
      }
      this.reportType = 2
    } else if (this.data.reportType == 'allTransactions') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 3,
        fromDate: this.data.selectedElement.fromDate,
        toDate: this.data.selectedElement.toDate
      }
      this.reportType = 3
    } else if (this.data.reportType == 'unrealisedTransactions') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 4,
        fromDate: this.data.selectedElement.fromDate,
        toDate: this.data.selectedElement.toDate
      }
      this.reportType = 4
    } else if (this.data.reportType == 'capitalGainSummary') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 5,
        from: this.data.selectedElement.from,
        to: this.data.selectedElement.to,
      }
      this.reportType = 5
    } else if (this.data.reportType == 'capitalGainDetails') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 6,
        from: this.data.selectedElement.from,
        to: this.data.selectedElement.to,
      }
      this.reportType = 6
    }
    this.dataClients = {
      clientId: 97118
    }
    const obj = {
      advisorId: AuthService.getAdvisorId(),
      reportTypeId: 1
    };
    this.backOfficeService.getClientIdByLoop(this.setObj).subscribe(
      data => {
        console.log('getClientIdByLoop ==', data)
        this.dialogRef.close('');
      }
    );
    this.getDetails(this.dataClients)
  }
  sendNowCount() {
    const obj = {
      advisorId: this.advisorId,
      reportTypeId: this.reportType
    };
    this.backOfficeService.clientCount(obj).subscribe(
      data => this.clientCountRes(data)
    );
  }
  clientCountRes(data) {
    this.clientCount = data
    console.log('client count',this.clientCount)
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