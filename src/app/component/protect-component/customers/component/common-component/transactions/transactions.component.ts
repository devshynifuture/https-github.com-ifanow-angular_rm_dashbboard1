import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  displayedColumns = ['srno', 'type', 'date', 'amt', 'nav', 'unit', 'bunit', 'days', 'icons'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  srno: string;
  type: string;
  date: string;
  amt: string;
  nav: string;
  unit: string;
  bunit: string;
  days: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { srno: '1', type: 'Purchase', date: '14/05/2015', amt: '2,500', nav: '10.20', unit: '129.24', bunit: '129.24', days: '180' },
  { srno: '2', type: 'SIP', date: '14/05/2015', amt: '2,500', nav: '10.20', unit: '129.24', bunit: '129.24', days: '180' },
];