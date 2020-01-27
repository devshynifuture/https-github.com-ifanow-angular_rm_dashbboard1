import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-insurance-planning',
  templateUrl: './add-insurance-planning.component.html',
  styleUrls: ['./add-insurance-planning.component.scss']
})
export class AddInsurancePlanningComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'critical', 'cancer'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {

  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Rahul Jain' },
  { position: 'Shilpa Jain' },
  { position: 'Shreya Jain' },
  { position: 'Manu Jain' },

];
export interface PeriodicElement1 {

  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Rahul Jain' },
  { position: 'Shilpa Jain' },
  { position: 'Shreya Jain' },
  { position: 'Manu Jain' },

];