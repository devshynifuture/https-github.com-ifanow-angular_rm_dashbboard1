import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reconciliation-details-view',
  templateUrl: './reconciliation-details-view.component.html',
  styleUrls: ['./reconciliation-details-view.component.scss']
})
export class ReconciliationDetailsViewComponent implements OnInit {


  displayedColumns: string[] = ['unitOne', 'unitsRta', 'difference'];
  dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = ['checkbox', 'transactionType', 'date', 'amount', 'units', 'balanceUnits', 'action'];
  dataSource1 = ELEMENT_DATA1;

  constructor() { }

  ngOnInit() {
  }

}

export interface PeriodicElement {
  unitOne: string;
  unitsRta: string;
  difference: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { unitOne: '0', unitsRta: '463.820', difference: '463.82', },
];

export interface PeriodicElement1 {
  checkbox: string;
  transactionType: string;
  date: string;
  amount: string;
  units: string;
  balanceUnits: string;
  action: string;


}
const ELEMENT_DATA1: PeriodicElement1[] = [
  { checkbox: ' ', transactionType: 'SIP', date: '07/01/2019', amount: '5,000.00', units: '156.23', balanceUnits: '156.23', action: ' ' },
  { checkbox: ' ', transactionType: 'Transfer Out Change of Broker', date: '07/01/2019', amount: '5,000.00', units: '156.23', balanceUnits: '156.23', action: ' ' },
];
