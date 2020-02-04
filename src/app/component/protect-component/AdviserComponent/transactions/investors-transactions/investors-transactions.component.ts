import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-investors-transactions',
  templateUrl: './investors-transactions.component.html',
  styleUrls: ['./investors-transactions.component.scss']
})
export class InvestorsTransactionsComponent implements OnInit {
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
    position: 'NSE', name: 'ARN-83865', weight: 'Rahul Jain', symbol: 'AATPJ1239L', bank: 'Individual', bankac: 'Anyone or survivor',
    amt: '5011102595', type: '50,000', status: 'Investment ready'
  },

];