import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-report-sending',
  templateUrl: './bulk-report-sending.component.html',
  styleUrls: ['./bulk-report-sending.component.scss']
})
export class BulkReportSendingComponent implements OnInit {
  displayedColumns: string[] = ['type', 'sendDate', 'recipients', 'emails', 'status'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }


}
export interface PeriodicElement {
  type: string;
  sendDate: string;
  recipients: string;
  emails: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { type: 'MF Overview / MF Summary / MF Capital gains - Summary', sendDate: '02/05/2020', recipients: '115', emails: '2', status: 'Sent' },
  { type: 'MF Overview / MF Summary', sendDate: '02/05/2020', recipients: '115', emails: '2', status: 'Sent' },

];