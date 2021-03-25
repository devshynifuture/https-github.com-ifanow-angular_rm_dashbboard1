import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenes-return-inflation',
  templateUrl: './expenes-return-inflation.component.html',
  styleUrls: ['./expenes-return-inflation.component.scss']
})
export class ExpenesReturnInflationComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  displayedColumns1: string[] = ['position', 'name'];
  dataSource1 = ELEMENT_DATA1;
  displayedColumns2: string[] = ['position', 'name'];
  dataSource2 = ELEMENT_DATA1;
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
export interface PeriodicElement2 {
  name: string;
  position: string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  { position: 'Traditional', name: '6%', },

  { position: 'ULIP', name: '6%', },


]