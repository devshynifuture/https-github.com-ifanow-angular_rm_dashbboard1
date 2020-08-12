import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-refer-earn',
  templateUrl: './refer-earn.component.html',
  styleUrls: ['./refer-earn.component.scss']
})
export class ReferEarnComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
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
  { position: 'Amitesh Anand', name: 'Trial user', weight: '₹0' },
  { position: 'Rajan Prakash', name: 'Successfully signed up', weight: '₹2,0000' },
  { position: 'Sunil Kumar', name: 'Successfully signed up', weight: '₹2,000' },
  { position: 'Arnav Pandit', name: 'Successfully signed up', weight: '₹2,000' },

];

