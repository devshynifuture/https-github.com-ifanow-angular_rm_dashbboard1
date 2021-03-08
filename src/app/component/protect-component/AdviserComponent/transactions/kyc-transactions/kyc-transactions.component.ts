import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kyc-transactions',
  templateUrl: './kyc-transactions.component.html',
  styleUrls: ['./kyc-transactions.component.scss']
})
export class KycTransactionsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'email', 'status', 'actions'];
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
  status: string;
  email: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Sagar Shroff PMS', name: 'Sagar Shroff', weight: 'ALWPG5809L', symbol: '+91 9887458745',
    email: 'sagar@futurewise.co.in', status: 'Verified '
  },

];