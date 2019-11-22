import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance-plan',
  templateUrl: './insurance-plan.component.html',
  styleUrls: ['./insurance-plan.component.scss']
})
export class InsurancePlanComponent implements OnInit {
  displayedColumns = ['position', 'name', 'weight', 'symbol','icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1 = ['name', 'sum', 'annual', 'ret','advice'];
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
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: "HDFC Ergo My Health Suraksha", name: '7,00,000', weight: "19,201", symbol: 'Waiting for approval'},
];
export interface PeriodicElement1 {
  name: string;
  sum: string;
  annual: string;
  ret: string;
  advice:string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {name: "LIC Jeevan Saral", sum: '20,00,000', annual: "27,000", ret: '4.78%',advice:'Stop paying premiums'},
];