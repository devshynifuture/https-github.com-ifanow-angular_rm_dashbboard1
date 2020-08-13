import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bills-payments',
  templateUrl: './bills-payments.component.html',
  styleUrls: ['./bills-payments.component.scss']
})
export class BillsPaymentsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'amt', 'balance'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'amt', 'balance'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  amt: string;
  balance: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'INV-19-20-104031', name: '17/02/2020', weight: 'Overdue', symbol: '17/02/2020', amt: '₹1,931.82', balance: '₹1,931.82' },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  amt: string;
  balance: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'INV-19-20-104031', name: '17/02/2020', weight: 'Overdue', symbol: '17/02/2020', amt: '₹1,931.82', balance: '₹1,931.82' },

];