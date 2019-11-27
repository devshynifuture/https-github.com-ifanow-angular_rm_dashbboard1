import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  position: string;
  name: string;
  weight: string;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Fixed Deposit', name: 'Continue till maturity', weight: '13,000', symbol: '5,28,000'},
  {position: 'LIC Jeevan Saral', name: 'Pre close this asset', weight: '13,000', symbol: '5,28,000'},
];
@Component({
  selector: 'app-goals-plan',
  templateUrl: './goals-plan.component.html',
  styleUrls: ['./goals-plan.component.scss']
})
export class GoalsPlanComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','icons'];
  dataSource = ELEMENT_DATA;
}
