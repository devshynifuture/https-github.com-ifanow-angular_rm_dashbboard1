import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketplace-calls',
  templateUrl: './marketplace-calls.component.html',
  styleUrls: ['./marketplace-calls.component.scss']
})
export class MarketplaceCallsComponent implements OnInit {
 displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','mail','deatils','menus'];
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
  mail:string;
  deatils:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: '01/02/2020', name: '11.00 AM - 11.30 AM (30 mins)', weight: 'Rahul Jain', symbol: '9874539874',mail:'Rahuljain@mail.com',deatils:'Views'},
 
];