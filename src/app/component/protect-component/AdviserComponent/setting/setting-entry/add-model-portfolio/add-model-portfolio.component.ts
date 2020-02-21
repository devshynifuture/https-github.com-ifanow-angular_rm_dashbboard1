import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-model-portfolio',
  templateUrl: './add-model-portfolio.component.html',
  styleUrls: ['./add-model-portfolio.component.scss']
})
export class AddModelPortfolioComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth', name: 'Equity - Large cap',
    weight: '40%'
  },
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth', name: 'Equity - Large cap',
    weight: '60%'
  },
];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth ', name: 'Equity',
    weight: 'Equity - Large cap', symbol: '48%'
  },
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth ', name: 'Equity',
    weight: 'Equity - Large cap', symbol: '48%'
  },
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth ', name: 'Equity',
    weight: 'Equity - Large cap', symbol: '48%'
  },
  {
    position: 'Mirae - Equity Savings Fund - Regular Plan - Growth ', name: 'Equity',
    weight: 'Equity - Large cap', symbol: '48%'
  },
];