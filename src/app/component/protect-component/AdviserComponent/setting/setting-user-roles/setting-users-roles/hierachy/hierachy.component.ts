import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hierachy',
  templateUrl: './hierachy.component.html',
  styleUrls: ['./hierachy.component.scss']
})
export class HierachyComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'role', 'report', 'icons'];
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
  report: string;
  role: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 'Ronak Hindocha', name: 'Active', weight: '+91 9987412342',
    symbol: 'ronak.hindocha@futurewise.co.in', role: 'Admin', report: '-'
  },

  {
    position: 'Ronak Hindocha', name: 'Active', weight: '+91 9987412342',
    symbol: 'ronak.hindocha@futurewise.co.in', role: 'Admin', report: 'Ronak Hindocha'
  },
  {
    position: 'Ronak Hindocha', name: 'Active', weight: '+91 9987412342',
    symbol: 'ronak.hindocha@futurewise.co.in', role: 'Admin', report: 'ADD REPORTING MANAGER'
  },
];