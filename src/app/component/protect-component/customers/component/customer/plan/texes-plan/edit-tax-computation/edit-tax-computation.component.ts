import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-tax-computation',
  templateUrl: './edit-tax-computation.component.html',
  styleUrls: ['./edit-tax-computation.component.scss']
})
export class EditTaxComputationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name', 'weight', 'symbol', 'icons'];
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
  { position: "Life insurance premium", name: '71,076', weight: "71,076" },

];
export interface PeriodicElement1 {
  name: string;
  position: string;
  weight: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: "Life insurance premium", name: '71,076', weight: "71,076" },

];