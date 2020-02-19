import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scheme-basket',
  templateUrl: './scheme-basket.component.html',
  styleUrls: ['./scheme-basket.component.scss']
})
export class SchemeBasketComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'ldate', 'rdate', 'status', 'icons'];
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
  ldate: string;
  rdate: string;
  status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth 1', name: 'Equity',
    weight: 'Equity - Large cap', symbol: '23/09/2019', ldate: '23/09/2019', rdate: '-', status: 'Recommended'
  },

];