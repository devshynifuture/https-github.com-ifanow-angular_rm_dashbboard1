import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-component',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  displayedColumns = ['checkbox', 'position', 'name', 'img', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit() {
  }

  // tabs = ['Primary', 'Social', 'Promotions', 'Forum'];
  // selected = new FormControl(0);


}
export interface PeriodicElement {
  name: string;
  position: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },
  { position: "FUTUREWISE TECHNOLO.", name: 'Rahul Jain s ', symbol: '12.29 PM' },

];