import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insurance-return-inflation',
  templateUrl: './insurance-return-inflation.component.html',
  styleUrls: ['./insurance-return-inflation.component.scss']
})
export class InsuranceReturnInflationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name'];
  dataSource1 = ELEMENT_DATA1;
  constructor() { }

  ngOnInit() {
  }

}
export interface PeriodicElement {
  name: string;
  position: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 'Health', name: '6%', },
  { position: 'Critical Illness', name: '6%', },
  { position: 'Motor', name: '6%', },
  { position: 'Travel', name: '6%', },

];
export interface PeriodicElement1 {
  name: string;
  position: string;

}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { position: 'Traditional', name: '6%', },

  { position: 'ULIP', name: '6%', },


]