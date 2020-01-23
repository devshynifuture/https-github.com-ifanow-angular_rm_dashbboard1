import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';

export interface PeriodicElement {
  date: string;
  invoice: string;
  status: string;
  ddate: string;
  amount: string;
  balance: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { date: '26/08/2019', invoice: 'INV-19-20-103001', status: 'OVERDUE', ddate: '05/09/2019', amount: 'Rs.20,000', balance: 'Rs.20,000' },
  { date: '28/08/2019', invoice: 'INV-19-20-103012', status: 'PAID', ddate: '05/09/2019', amount: 'Rs.1,20,000', balance: 'Rs.0' },
  { date: '29/08/2019', invoice: 'INV-19-20-103001', status: 'SENT', ddate: '05/09/2019', amount: 'Rs.7,000', balance: 'Rs.7,000' },

];
@Component({
  selector: 'app-clients-dashboard',
  templateUrl: './clients-dashboard.component.html',
  styleUrls: ['./clients-dashboard.component.scss']
})
export class ClientsDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  displayedColumns: string[] = ['date', 'invoice', 'status', 'ddate', 'amount', 'balance'];
  dataSource = ELEMENT_DATA;
  showInvoice() {
    console.log("sarv")
  }
  Close() {
    // $('#myRightSidenav').css({ "width": "" });
  }
}
