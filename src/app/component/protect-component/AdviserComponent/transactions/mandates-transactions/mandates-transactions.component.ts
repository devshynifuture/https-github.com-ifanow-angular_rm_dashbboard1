import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mandates-transactions',
  templateUrl: './mandates-transactions.component.html',
  styleUrls: ['./mandates-transactions.component.scss']
})
export class MandatesTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'bank', 'bankac', 'amt', 'type', 'status', 'icons'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
  bank: string;
  bankac: string;
  amt: string;
  type: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain', symbol: '5011102595', bank: 'ICICI Bank', bankac: '001101330032',
    amt: '50,000', type: 'E-Mandate', status: 'Approved'
  },

];