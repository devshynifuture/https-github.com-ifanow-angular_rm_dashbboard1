import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketplace-leads',
  templateUrl: './marketplace-leads.component.html',
  styleUrls: ['./marketplace-leads.component.scss']
})
export class MarketplaceLeadsComponent implements OnInit {
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','ls','lao','lown','icons','menus'];
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
  ls:string;
  lao:string;
  lown:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Rahul Jain', name: '9874593251', weight: 'Rahuljain@mail.com', symbol: 'Maketplace',
  ls:'call Scheduled',
  lao:'06/04/2020',lown:'Aniket'},
 
];