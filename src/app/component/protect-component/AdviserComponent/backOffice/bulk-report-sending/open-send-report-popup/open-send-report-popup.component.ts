import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DialogData } from 'src/app/common/link-bank/link-bank.component';
import { EventService } from 'src/app/Data-service/event.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BackOfficeService } from '../../back-office.service';
import { AuthService } from 'src/app/auth-service/authService';
import { MatProgressButtonOptions } from 'src/app/common/progress-button/progress-button.component';

@Component({
  selector: 'app-open-send-report-popup',
  templateUrl: './open-send-report-popup.component.html',
  styleUrls: ['./open-send-report-popup.component.scss'],
})

export class OpenSendReportPopupComponent implements OnInit {
  barButtonOptions: MatProgressButtonOptions = {
    active: false,
    text: 'SEND NOW',
    buttonColor: 'accent',
    barColor: 'accent',
    raised: true,
    stroked: false,
    mode: 'determinate',
    value: 10,
    disabled: false,
    fullWidth: false,
  };
  displayedColumns: string[] = ['name', 'mfoverview',];
  sendReport: any;
  clientsSend: any;
  advisorId: any;
  dataClients: { clientId: number; };
  setObj: any;
  callBulk: boolean = false;
  reportType: any;
  clientCount: any;
  saveSettingMfClients: any;
  isLoading: boolean;
  data: Array<any> = [{}, {}, {}];
  clientDetails = new MatTableDataSource(this.data);
  checkFlag: boolean = false;
  overviewAll: boolean = false
  sendCopy: boolean = false;
  sendNow: boolean = false;
  constructor(public dialogRef: MatDialogRef<OpenSendReportPopupComponent>,
    private fb: FormBuilder,
    private backOfficeService: BackOfficeService,
    @Inject(MAT_DIALOG_DATA) public data1: DialogData, private eventService: EventService, private backOffice: BackOfficeService) {

    this.advisorId = AuthService.getAdvisorId()
  }

  ngOnInit() {
    this.isLoading = false
    this.saveSettingMfClients = []
    this.clientDetails.data = [{}, {}, {}];
    console.log('reportType', this.data)
    if (this.data1.reportType == 'overview') {
      this.reportType = 1
    } else if (this.data1.reportType == 'summary') {
      this.reportType = 2
    } else if (this.data1.reportType == 'allTransactions') {
      this.reportType = 3
    } else if (this.data1.reportType == 'unrealisedTransactions') {
      this.reportType = 4
    } else if (this.data1.reportType == 'capitalGainSummary') {
      this.reportType = 5
    } else if (this.data1.reportType == 'capitalGainDetails') {
      this.reportType = 6
    }
    this.sendNowCount()
  }
  close() {
    this.dialogRef.close()
  }
  sendClientId() {
    this.callBulk = true
    this.sendNow = true
    if (this.data1.reportType == 'overview') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 1,
        sendCopy: false
      }
      this.reportType = 1
    } else if (this.data1.reportType == 'summary') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 2,
        toDate: this.data1.selectedElement.toDate,
        sendCopy: false
      }
      this.reportType = 2
    } else if (this.data1.reportType == 'allTransactions') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 3,
        fromDate: this.data1.selectedElement.fromDate,
        toDate: this.data1.selectedElement.toDate,
        sendCopy: false
      }
      this.reportType = 3
    } else if (this.data1.reportType == 'unrealisedTransactions') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 4,
        fromDate: this.data1.selectedElement.fromDate,
        toDate: this.data1.selectedElement.toDate,
        sendCopy: false
      }
      this.reportType = 4
    } else if (this.data1.reportType == 'capitalGainSummary') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 5,
        fromYear: this.data1.selectedElement.from,
        toYear: this.data1.selectedElement.to,
        sendCopy: false
      }
      this.reportType = 5
    } else if (this.data1.reportType == 'capitalGainDetails') {
      this.setObj = {
        advisorId: AuthService.getAdvisorId(),
        reportTypeId: 6,
        fromYear: this.data1.selectedElement.from,
        toYear: this.data1.selectedElement.to,
        sendCopy: false
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
    this.setObj.sendCopy = this.sendCopy
    this.backOfficeService.getClientIdByLoop(this.setObj).subscribe(
      data => {
        console.log('getClientIdByLoop ==', data)
        this.dialogRef.close('');
      }
    );
    this.getDetails(this.dataClients)
  }
  sendNowCount() {
    this.isLoading = true
    const obj = {
      advisorId: this.advisorId,
      reportTypeId: this.reportType
    };
    this.backOfficeService.clientCount(obj).subscribe(
      data => this.clientCountRes(data)
    );
  }
  clientCountRes(data) {
    this.isLoading = false
    this.clientCount = data
    if (data.clientDetails) {
      this.clientDetails.data = data.clientDetails
      this.clientDetails.data.forEach(element => {
        if (this.reportType == 1) {
          element.checkFlag = element.overview
        } else if (this.reportType == 2) {
          element.checkFlag = element.summary
        } else if (this.reportType == 3) {
          element.checkFlag = element.allTransaction
        } else if (this.reportType == 4) {
          element.checkFlag = element.unrealizedTransaction
        } else if (this.reportType == 5) {
          element.checkFlag = element.capitalGainSummary
        } else {
          element.checkFlag = element.capitalGainDetailed
        }
      });
      console.log('client count', this.clientCount)
    } else {
      this.clientDetails.data = []
    }

  }
  selectReportAll(event, reportType) {
    this.isLoading = true
    let obj = {
      advisorId: this.advisorId,
      reportTypeId: reportType,
      selected: event.checked
    }
    console.log(obj)
    this.backOffice.saveSettingAll(obj).subscribe(
      data => this.saveSettingAllRes(data, event, reportType)
    );
  }
  saveSettingAllRes(data, event, reportType) {
    this.sendNowCount()
    this.isLoading = false
    //this.getMutualFundClient(0)
    //this.saveEvent = event
    this.reportType = reportType
    this.checkFlag = event.checked
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
      mode: this.data1.reportType,
      fromDate: this.data1.selectedElement.fromDate,
      toDate: this.data1.selectedElement.toDate,
      fromYear: this.data1.selectedElement.from,
      toYear: this.data1.selectedElement.to,
    }
  }
  procced() {
    this.dialogRef.close('');
  }

  onNoClick(value): void {
    this.dialogRef.close('');

  }
  selectReport(event, element, reportType) {

    console.log('element', element)
    if (reportType == 1) {
      element.overview = event.checked
    } else if (reportType == 2) {
      element.summary = event.checked
    } else if (reportType == 3) {
      element.allTransaction = event.checked
    } else if (reportType == 4) {
      element.unrealizedTransaction = event.checked
    } else if (reportType == 5) {
      element.capitalGainSummary = event.checked
    } else {
      element.capitalGainDetailed = event.checked
    }
    this.saveSettingMfClients.push(element)

    console.log('saveSettingMfClients', this.saveSettingMfClients)
    this.backOffice.saveSetting(element).subscribe(
      data => this.saveSettingRes(data)
    );
  }
  saveSettingRes(data) {
    this.sendNowCount()
  }
}