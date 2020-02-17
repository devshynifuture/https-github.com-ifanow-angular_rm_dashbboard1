import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-returnsinflation',
  templateUrl: './plan-returnsinflation.component.html',
  styleUrls: ['./plan-returnsinflation.component.scss']
})
export class PlanReturnsinflationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns2: string[] = ['position', 'name'];
  dataSource2 = ELEMENT_DATA2;
  displayedColumns3: string[] = ['position', 'name'];
  dataSource3 = ELEMENT_DATA3;
  displayedColumns4: string[] = ['position', 'name'];
  dataSource4 = ELEMENT_DATA4;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {

  position: string;
  name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Inflation rate', name: '7%' },

];
export interface PeriodicElement2 {

  position: string;
  name: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: 'Inflation rate', name: '7%' },

];
export interface PeriodicElement3 {

  position: string;
  name: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  { position: 'Debt asset class', name: '7%' },
  { position: 'Equity asset class', name: '17%' },

];
export interface PeriodicElement4 {

  position: string;
  name: string;
}

const ELEMENT_DATA4: PeriodicElement4[] = [
  { position: 'Debt asset class', name: '7%' },
  { position: 'Equity asset class', name: '17%' },

];